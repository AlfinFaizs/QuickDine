import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { midtransService, MidtransWebhookPayload } from "@/services/payment/midtrans.service";
import { getNotificationService } from "@/services/notification";

export async function POST(request: NextRequest) {
  try {
    const payload: MidtransWebhookPayload = await request.json();

    // 1. Verify Midtrans Signature
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

    const supabaseAdmin = createAdminClient();

    if (isPaid) {
      // 2. Fetch order data
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .select("*, restaurant:restaurants(*), table:restaurant_tables(*)")
        .eq("id", order_id)
        .single();

      if (orderError || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check idempotency: If already paid, return 200 OK
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

      // 4. Transition table from locked to reserved
      if (order.table_id) {
        await supabaseAdmin
          .from("restaurant_tables")
          .update({
            status: "reserved",
            locked_until: null,
          })
          .eq("id", order.table_id);
      }

      // 5. Credit restaurant balance ledger (100% subtotal)
      await supabaseAdmin.from("balance_ledgers").insert({
        restaurant_id: order.restaurant_id,
        order_id: order.id,
        amount: order.subtotal_amount,
        type: "credit",
        description: `Penjualan Order #${order.id.substring(0, 8)}`,
        status: "completed",
      });

      // 6. Send WhatsApp Notifications via Fonnte
      const notificationService = getNotificationService();
      const restaurantName = order.restaurant?.name || "Resto QuickDine";
      const tableNumber = order.table?.table_number || "-";

      // Notify Cashier Group
      if (order.restaurant?.wa_group_id) {
        notificationService.sendToCashierGroup(order.restaurant.wa_group_id, {
          orderId: order.id,
          restaurantName,
          tableNumber,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          arrivalTime: order.arrival_time,
          items: [],
          totalAmount: order.total_amount,
        }).catch(console.error);
      }

      // Send Customer Receipt
      notificationService.sendCustomerReceipt(order.customer_phone, {
        orderId: order.id,
        restaurantName,
        tableNumber,
        customerName: order.customer_name,
        arrivalTime: order.arrival_time,
        items: [],
        subtotal: order.subtotal_amount,
        platformFee: order.platform_fee,
        total: order.total_amount,
        trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${order.restaurant?.slug}/order/${order.id}`,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[Midtrans Webhook Error]:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
