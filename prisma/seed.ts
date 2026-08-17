// prisma/seed.ts
// Skrip seeder otomatis untuk mengisi data master restoran, meja, menu, dan RPC functions ke Supabase

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Memulai sinkronisasi dan seeding database Supabase QuickDine...");

  // 1. Eksekusi RPC Functions PostgreSQL
  const rpcSql = `
    -- Atomic Table Lock
    CREATE OR REPLACE FUNCTION lock_table_for_checkout(
      p_table_id      UUID,
      p_restaurant_id UUID,
      p_lock_duration INTERVAL DEFAULT '10 minutes'
    )
    RETURNS restaurant_tables
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_result restaurant_tables;
    BEGIN
      UPDATE restaurant_tables
      SET
        status       = 'locked',
        locked_until = NOW() + p_lock_duration
      WHERE
        id            = p_table_id
        AND restaurant_id = p_restaurant_id
        AND status    = 'vacant'
      RETURNING * INTO v_result;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'TABLE_NOT_AVAILABLE'
          USING HINT = 'Meja sudah diambil atau sedang terkunci oleh customer lain.';
      END IF;

      RETURN v_result;
    END;
    $$;

    -- Cron Cleanup for Expired Locked Tables
    CREATE OR REPLACE FUNCTION cleanup_expired_locks()
    RETURNS INT
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_count INT;
    BEGIN
      UPDATE restaurant_tables
      SET status = 'vacant', locked_until = NULL
      WHERE status = 'locked'
        AND locked_until < NOW();

      GET DIAGNOSTICS v_count = ROW_COUNT;
      RETURN v_count;
    END;
    $$;

    -- Set Table to Occupied
    CREATE OR REPLACE FUNCTION set_table_occupied(p_table_id UUID)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      UPDATE restaurant_tables
      SET status = 'occupied', locked_until = NULL
      WHERE id = p_table_id AND status = 'reserved';
    END;
    $$;

    -- Set Table to Vacant
    CREATE OR REPLACE FUNCTION release_table(p_table_id UUID)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      UPDATE restaurant_tables
      SET status = 'vacant', locked_until = NULL
      WHERE id = p_table_id;
    END;
    $$;
  `;

  await pool.query(rpcSql);
  console.log("✅ 4 Fungsi Atomik RPC PostgreSQL (lock_table, cleanup, set_occupied, release_table) berhasil terpasang di Supabase");

  // 2. Buat / Upsert Restoran Utama (Sate Khas Senayan Pakubuwono)
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "sate-khas-senayan" },
    update: {
      name: "Sate Khas Senayan Pakubuwono",
      phoneWhatsapp: "081234567890",
      ownerPhone: "081234567890",
      telegramChatId: "-100441846",
      bankName: "Bank Central Asia (BCA)",
      bankAccountNumber: "8830192841",
      bankAccountHolder: "PT QuickDine Kuliner Mitra",
      cookTriggerMinutes: 15,
      subscriptionStatus: "active",
    },
    create: {
      name: "Sate Khas Senayan Pakubuwono",
      slug: "sate-khas-senayan",
      phoneWhatsapp: "081234567890",
      ownerPhone: "081234567890",
      telegramChatId: "-100441846",
      bankName: "Bank Central Asia (BCA)",
      bankAccountNumber: "8830192841",
      bankAccountHolder: "PT QuickDine Kuliner Mitra",
      cookTriggerMinutes: 15,
      subscriptionStatus: "active",
    },
  });

  console.log(`✅ Restoran siap: ${restaurant.name} (ID: ${restaurant.id})`);

  // 3. Buat Langganan Aktif
  await prisma.subscription.create({
    data: {
      restaurantId: restaurant.id,
      plan: "flat_monthly",
      amount: 200000,
      status: "active",
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentReference: "SUB-AUTO-INITIAL",
    },
  });
  console.log("✅ Subscription flat bulanan Rp200.000 aktif");

  // 4. Buat 10 Denah Meja
  const tablesData = [
    { number: "01", capacity: 2, status: "occupied" },
    { number: "02", capacity: 4, status: "reserved" },
    { number: "03", capacity: 2, status: "vacant" },
    { number: "04", capacity: 4, status: "reserved" },
    { number: "05", capacity: 6, status: "vacant" },
    { number: "06", capacity: 2, status: "vacant" },
    { number: "07", capacity: 4, status: "vacant" },
    { number: "08", capacity: 8, status: "vacant" },
    { number: "09", capacity: 2, status: "vacant" },
    { number: "10", capacity: 4, status: "vacant" },
  ];

  for (const t of tablesData) {
    await prisma.restaurantTable.upsert({
      where: {
        unique_resto_table: {
          restaurantId: restaurant.id,
          tableNumber: t.number,
        },
      },
      update: {
        capacity: t.capacity,
        status: t.status,
      },
      create: {
        restaurantId: restaurant.id,
        tableNumber: t.number,
        capacity: t.capacity,
        status: t.status,
      },
    });
  }
  console.log("✅ 10 Meja restoran berhasil di-seed (Meja 01 s/d 10)");

  // 5. Buat Menu Makanan Lengkap & Variasi
  const menuItemsData = [
    {
      name: "Sate Ayam Madura (10 Tusuk)",
      categoryName: "Sate & Panggang",
      price: 45000,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
      variants: [
        {
          name: "Level Pedas",
          options: ["Tidak Pedas", "Sedang (Cabai 2)", "Pedas (Cabai 5)"],
        },
      ],
    },
    {
      name: "Sate Kambing Muda Spesial (10 Tusuk)",
      categoryName: "Sate & Panggang",
      price: 65000,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      variants: [
        {
          name: "Pilihan Bumbu",
          options: ["Bumbu Kecap Rawit Tomat", "Bumbu Kacang Gurih"],
        },
      ],
    },
    {
      name: "Nasi Goreng Kambing Kebon Sirih",
      categoryName: "Makanan Utama",
      price: 48000,
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
      variants: [
        {
          name: "Tingkat Kepedasan",
          options: ["Biasa", "Pedas Gurih", "Ekstra Pedas"],
        },
      ],
    },
    {
      name: "Tahu Telur Spesial Petis",
      categoryName: "Makanan Utama",
      price: 32000,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      variants: [],
    },
    {
      name: "Es Teh Manis Pandan Wangi",
      categoryName: "Minuman",
      price: 12000,
      imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80",
      variants: [
        {
          name: "Tingkat Kemanisan",
          options: ["Normal Manis", "Less Sugar", "No Sugar"],
        },
      ],
    },
    {
      name: "Wedang Jahe Rempah Gula Aren",
      categoryName: "Minuman",
      price: 18000,
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      variants: [],
    },
  ];

  // Hapus menu lama jika ada untuk idempotency
  await prisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });

  for (const item of menuItemsData) {
    await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryName: item.categoryName,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: true,
        variants: item.variants,
      },
    });
  }
  console.log("✅ 6 Master menu hidangan lezat berhasil di-seed");

  console.log("\n🎉 SEEDING & SYNC SELESAI SUKSES! Database Supabase siap 100%!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
