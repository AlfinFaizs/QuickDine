// src/app/api/webhooks/midtrans/route.ts
// Webhook handler resmi notifikasi pembayaran Midtrans terintegrasi Bot Telegram Dapur

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { midtransService, MidtransWebhookPayload } from "@/services/payment/midtrans.service";
import { getTelegramNotificationService, getWhatsAppNotificationService } from "@/services/notification";

export async function POST(request: NextRequest) {
  try {
    const payload: MidtransWebhookPayload = await request.json();

    // 1. Verify Midtrans Signature (jika env production terpasang)
    if (process.env.MIDTRANS_SERVER_KEY) {
      const isValid = midtransService.verifySignature(payload);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    const { order_id, transaction_status, fraud_status, transaction_id } = payload;
    const isPaid =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    const isFailedOrExpired =
      transaction_status === "expire" ||
      transaction_status === "cancel" ||
      transaction_status === "deny";

    const supabaseAdmin = createAdminClient();

    // A. JIKA PEMBAYARAN BERHASIL (LUNAS)
    if (isPaid) {
      // 2. Fetch order data
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .select("*, restaurant:restaurants(*), table:restaurant_tables(*), items:order_items(*)")
        .eq("id", order_id)
        .single();

      if (orderError || !order) {
        // Fallback untuk mode mock / sandbox
        console.log(`[MIDTRANS WEBHOOK] Order #${order_id} berhasil diproses (Mock Mode).`);
        return NextResponse.json({ success: true, mode: "mock" });
      }

      // Check idempotency: Jika sudah pernah lunas, return 200 OK
      if (order.payment_status === "paid") {
        return NextResponse.json({ message: "Already processed" }, { status: 200 });
      }

      // 3. Update Order to paid and received
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "received",
          payment_reference_id: transaction_id || payload.order_id,
        })
        .eq("id", order_id);

      // 4. Ubah status meja menjadi reserved / terisi
      if (order.table_id) {
        await supabaseAdmin
          .from("restaurant_tables")
          .update({
            status: "reserved",
            locked_until: null,
          })
          .eq("id", order.table_id);
      }

      // 5. Catat saldo bersih ke buku kas restoran (100% subtotal)
      await supabaseAdmin.from("balance_ledgers").insert({
        restaurant_id: order.restaurant_id,
        order_id: order.id,
        amount: order.subtotal_amount,
        type: "credit",
        description: `Penjualan Order #${order.id.substring(0, 8)}`,
        status: "completed",
      });

      // 6. Kirim Notifikasi Instan ke Grup Telegram Dapur Restoran
      const telegramService = getTelegramNotificationService();
      const restaurantName = order.restaurant?.name || "Restoran QuickDine";
      const tableNumber = order.table?.table_number || "Tanpa Meja";
      // Gunakan telegram_chat_id dari data resto (kolom resmi)
      const telegramChatId = order.restaurant?.telegram_chat_id || "";

      const orderItems = (order.items || []).map((i: { item_name?: string; quantity: number; special_notes?: string }) => ({
        name: i.item_name || "Menu Makanan",
        quantity: i.quantity || 1,
        notes: i.special_notes || "",
      }));

      if (telegramChatId) {
        await telegramService.sendToCashierGroup(telegramChatId, {
          orderId: order.id.substring(0, 8).toUpperCase(),
          restaurantName,
          tableNumber,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          arrivalTime: order.arrival_time,
          items: orderItems.length > 0 ? orderItems : [{ name: "Paket Hidangan Resto", quantity: 1 }],
          totalAmount: order.total_amount,
        });
      } else {
        console.warn(`[MIDTRANS WEBHOOK] Restoran ${restaurantName} belum mengisi telegram_chat_id. Notifikasi dilewati.`);
      }

      // 7. Kirim Notifikasi WA (Opsional Backup)
      if (order.restaurant?.wa_group_id) {
        const waService = getWhatsAppNotificationService();
        waService.sendToCashierGroup(order.restaurant.wa_group_id, {
          orderId: order.id,
          restaurantName,
          tableNumber,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          arrivalTime: order.arrival_time,
          items: orderItems,
          totalAmount: order.total_amount,
        }).catch(console.error);
      }
    }

    // B. JIKA PEMBAYARAN EXPIRED / BATAL
    if (isFailedOrExpired) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("table_id")
        .eq("id", order_id)
        .single();

      if (order?.table_id) {
        // Buka kembali kunci meja menjadi VACANT
        await supabaseAdmin
          .from("restaurant_tables")
          .update({
            status: "vacant",
            locked_until: null,
          })
          .eq("id", order.table_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[Midtrans Webhook Error]:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
