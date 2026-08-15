"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateOrderFee } from "@/services/payment/fee-calculator";
import { midtransService } from "@/services/payment/midtrans.service";
import { SelectedVariant } from "@/types";

export interface CreateOrderParams {
  restaurantId: string;
  tableId?: string;
  customerName: string;
  customerPhone: string;
  arrivalTime: string; // ISO string
  paymentMethod: "qris" | "bca_va" | "mandiri_va" | "bri_va" | "bni_va";
  items: Array<{
    menuItemId?: string;
    itemName: string;
    itemPrice: number;
    quantity: number;
    selectedVariants?: SelectedVariant[];
    specialNotes?: string;
  }>;
}

export async function createOrderAction(params: CreateOrderParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Silakan login terlebih dahulu untuk menyelesaikan pesanan.",
      };
    }

    const subtotal = params.items.reduce(
      (sum, item) => sum + item.itemPrice * item.quantity,
      0
    );
    const { platformFee, total } = calculateOrderFee(subtotal, params.paymentMethod);

    // Compute grace_period_until: arrival_time + 15 minutes server-side
    const arrivalDate = new Date(params.arrivalTime);
    const gracePeriodDate = new Date(arrivalDate.getTime() + 15 * 60 * 1000);

    // 1. Insert order header
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: params.restaurantId,
        table_id: params.tableId || null,
        customer_user_id: user.id,
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        arrival_time: arrivalDate.toISOString(),
        grace_period_until: gracePeriodDate.toISOString(),
        subtotal_amount: subtotal,
        platform_fee: platformFee,
        total_amount: total,
        payment_method: params.paymentMethod,
        payment_status: "pending",
        order_status: "pending",
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return {
        success: false,
        error: orderError?.message || "Gagal membuat pesanan.",
      };
    }

    // 2. Insert order items
    const itemsToInsert = params.items.map((item) => ({
      order_id: orderData.id,
      menu_item_id: item.menuItemId || null,
      item_name: item.itemName,
      item_price: item.itemPrice,
      quantity: item.quantity,
      selected_variants: item.selectedVariants || [],
      special_notes: item.specialNotes || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("[createOrderAction] Items insert error:", itemsError);
    }

    // 3. Generate Midtrans Snap Token
    const snapResult = await midtransService.createSnapToken({
      orderId: orderData.id,
      grossAmount: total,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: user.email,
      items: params.items.map((i, idx) => ({
        id: i.menuItemId || `item_${idx}`,
        price: i.itemPrice,
        quantity: i.quantity,
        name: i.itemName,
      })),
    });

    return {
      success: true,
      orderId: orderData.id,
      snapToken: snapResult.token,
      redirectUrl: snapResult.redirectUrl,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}
