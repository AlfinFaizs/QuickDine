"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface RegisterPartnerParams {
  restaurantName: string;
  category: string;
  address: string;
  city: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  password?: string;
  totalTables: number;
  prepTimeMinutes: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${base}-${randomSuffix}`;
}

export async function registerPartnerAction(params: RegisterPartnerParams) {
  try {
    const supabaseAdmin = createAdminClient();
    const slug = generateSlug(params.restaurantName);

    // 1. Create or register Owner User in Supabase Auth
    let userId: string | null = null;
    if (params.password) {
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.createUser({
          email: params.ownerEmail,
          password: params.password,
          email_confirm: true,
          user_metadata: {
            full_name: params.ownerName,
            phone: params.ownerPhone,
          },
        });

      if (userError) {
        // If user already exists, report error
        return {
          success: false,
          error: `Pendaftaran gagal: ${userError.message}`,
        };
      }
      userId = userData.user.id;
    }

    // 2. Insert into restaurants table
    const { data: restaurant, error: restoError } = await supabaseAdmin
      .from("restaurants")
      .insert({
        name: params.restaurantName,
        slug: slug,
        phone_whatsapp: params.ownerPhone,
        owner_phone: params.ownerPhone,
        bank_name: params.bankName,
        bank_account_number: params.bankAccountNumber,
        bank_account_holder: params.bankAccountHolder,
        cook_trigger_minutes: params.prepTimeMinutes || 15,
        subscription_status: "trial", // Free Trial 14 Hari
      })
      .select()
      .single();

    if (restoError || !restaurant) {
      return {
        success: false,
        error: restoError?.message || "Gagal menyimpan data restoran.",
      };
    }

    // 3. Update User app_metadata with tenant claims: role 'owner' & restaurant_id
    if (userId) {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        app_metadata: {
          role: "owner",
          restaurant_id: restaurant.id,
        },
      });
    }

    // 4. Generate default tables (e.g. Meja 01 s/d Meja N)
    const tablesToInsert = Array.from(
      { length: params.totalTables || 8 },
      (_, idx) => {
        const tableNumber = String(idx + 1).padStart(2, "0");
        const capacity = idx % 3 === 0 ? 6 : idx % 2 === 0 ? 4 : 2;
        return {
          restaurant_id: restaurant.id,
          table_number: tableNumber,
          capacity: capacity,
          status: "vacant",
        };
      }
    );

    const { error: tablesError } = await supabaseAdmin
      .from("restaurant_tables")
      .insert(tablesToInsert);

    if (tablesError) {
      console.warn("[registerPartnerAction] Tables seed error:", tablesError);
    }

    return {
      success: true,
      restaurantId: restaurant.id,
      slug: restaurant.slug,
      message: "Restoran berhasil didaftarkan! Mengalihkan ke dashboard...",
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}
