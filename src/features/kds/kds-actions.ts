// src/features/kds/kds-actions.ts
// Server Actions untuk Layar Dapur (KDS): update status pesanan & siklus hidup meja

"use server";

import { createClient } from "@/lib/supabase/server";

export type KdsUpdateStatus = "cooking" | "ready" | "completed";

/**
 * Memperbarui status pesanan di dapur dan mengelola siklus hidup meja secara otomatis:
 * - received → cooking: Meja tidak berubah (masih reserved)
 * - cooking → ready: Meja tidak berubah (masih reserved)
 * - ready → completed: Meja direset ke VACANT via RPC release_table
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: KdsUpdateStatus,
  tableId?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Update status pesanan
    const { error: orderError } = await supabase
      .from("orders")
      .update({ order_status: newStatus })
      .eq("id", orderId);

    if (orderError) {
      return { success: false, error: orderError.message };
    }

    // 2. Jika pesanan selesai, lepas kunci meja kembali ke VACANT
    if (newStatus === "completed" && tableId) {
      const { error: tableError } = await supabase.rpc("release_table", {
        p_table_id: tableId,
      });

      if (tableError) {
        // Catat error tapi jangan gagalkan seluruh operasi
        console.warn("[KDS] Gagal mereset meja via RPC release_table:", tableError.message);
      }
    }

    // 3. Jika mulai dimasak, tandai meja sebagai occupied (tamu sudah duduk aktif)
    if (newStatus === "cooking" && tableId) {
      const { error: tableError } = await supabase.rpc("set_table_occupied", {
        p_table_id: tableId,
      });

      if (tableError) {
        console.warn("[KDS] Gagal set meja occupied via RPC set_table_occupied:", tableError.message);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}
