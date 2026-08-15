"use server";

import { createClient } from "@/lib/supabase/server";
import { RestaurantTable } from "@/types";

export async function lockTableAction(
  tableId: string,
  restaurantId: string
): Promise<{ success: boolean; table?: RestaurantTable; error?: string }> {
  try {
    const supabase = await createClient();

    // Call PostgreSQL RPC function lock_table_for_checkout
    const { data, error } = await supabase.rpc("lock_table_for_checkout", {
      p_table_id: tableId,
      p_restaurant_id: restaurantId,
      p_lock_duration: "10 minutes",
    });

    if (error) {
      if (error.message.includes("TABLE_NOT_AVAILABLE")) {
        return {
          success: false,
          error: "Maaf, meja ini baru saja dipilih atau sedang terkunci oleh pelanggan lain.",
        };
      }
      return { success: false, error: error.message };
    }

    return {
      success: true,
      table: data as RestaurantTable,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunci meja.";
    return { success: false, error: errorMsg };
  }
}
