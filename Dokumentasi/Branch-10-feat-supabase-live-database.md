# Branch 10 — `feat/supabase-live-database`

## Ringkasan Branch

Branch ini mengimplementasikan **Migrasi Penuh Database Cloud Supabase PostgreSQL, Pembuatan 7 Tabel Relasional Inti, 4 Fungsi Atomik RPC, dan Seeding Master Data Restoran**:
1. **Sinkronisasi Skema Database ke Cloud Supabase (`prisma db push`)** — Berhasil membuat 7 tabel relasional utama (`restaurants`, `subscriptions`, `restaurant_tables`, `menu_items`, `orders`, `order_items`, `balance_ledgers`) pada proyek Supabase `dghfusubadvbuccojmoc`.
2. **Pemasangan 4 Fungsi Atomik RPC PostgreSQL** — Mengaktifkan `lock_table_for_checkout` (kunci meja 10 menit anti-bentrok), `cleanup_expired_locks` (cron pelepasan meja expired), `set_table_occupied` (meja terisi saat mulai masak), dan `release_table` (pelepasan meja kembali ke kosong saat pesanan selesai).
3. **Seeding Master Data Nyata (`prisma/seed.ts`)** — Mengisi data awal restoran ("Sate Khas Senayan Pakubuwono"), langganan aktif, 10 meja restoran, dan 6 master hidangan menu makanan lengkap dengan variasi harga dan level pedas.
4. **Perbaikan 4 Hole Arsitektur & Sinkronisasi TypeScript** — Menambahkan kolom `telegram_chat_id` pada tabel resto, melengkapi siklus hidup meja di KDS (`src/features/kds/kds-actions.ts`), dan memperbaiki pemetaan field `order_items` di webhook.

---

## Tabel Database yang Berhasil Dibuat di Supabase

| Nama Tabel | Tipe | Jumlah Kolom | Relasi / Keterangan |
|---|---|---|---|
| **`restaurants`** | Master Tenant | 12 Kolom | Tabel master restoran mitra, nomor WhatsApp, `telegram_chat_id`, rekening bank, dan durasi pemicu masak. |
| **`subscriptions`** | Transaksional | 9 Kolom | Riwayat paket langganan bulanan flat Rp200.000/bulan per resto (FK ke `restaurants`). |
| **`restaurant_tables`** | Operasional | 8 Kolom | Master denah meja, kapasitas kursi, status (`vacant`, `locked`, `reserved`, `occupied`), dan timer `locked_until`. |
| **`menu_items`** | Katalog | 8 Kolom | Master menu makanan/minuman, harga, status ketersediaan, foto, dan JSONB `variants`. |
| **`orders`** | Transaksional | 15 Kolom | Header transaksi pesanan pelanggan, jam tiba, `grace_period_until`, `platform_fee`, status pembayaran, dan status pesanan. |
| **`order_items`** | Detail | 8 Kolom | Detail item hidangan per pesanan, snapshot harga, kuantitas, catatan koki, dan JSONB varian terpilih. |
| **`balance_ledgers`** | Finansial | 7 Kolom | Pembukuan kas saldo restoran (100% omset bersih tanpa potongan komisi makanan). |

---

## 4 Fungsi Atomik RPC PostgreSQL yang Aktif

| Nama Fungsi RPC | Parameter | Peran & Logika Bisnis |
|---|---|---|
| **`lock_table_for_checkout`** | `table_id`, `restaurant_id`, `lock_duration` | Mengunci meja secara atomik (`vacant` ➔ `locked` selama 10 menit) dengan `SECURITY DEFINER` anti-race condition. |
| **`cleanup_expired_locks`** | - | Membersihkan seluruh meja berstatus `locked` yang telah melewati batas `locked_until` kembali menjadi `vacant`. |
| **`set_table_occupied`** | `table_id` | Mengubah status meja dari `reserved` ➔ `occupied` saat koki mulai memasak hidangan di KDS Dapur. |
| **`release_table`** | `table_id` | Melepaskan meja kembali menjadi `vacant` (kosong) saat status pesanan diubah menjadi `completed` (selesai). |

---

## File Baru & Modifikasi

| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`prisma/schema.prisma`](file:///c:/My_Koding/QuickDine/prisma/schema.prisma) | **Branch-10** | 148 | Skema Prisma ORM 7 lengkap untuk 7 model tabel Supabase PostgreSQL. |
| [`prisma/seed.ts`](file:///c:/My_Koding/QuickDine/prisma/seed.ts) | **Branch-10** | 225 | **[BARU]** Skrip seeder otomatis untuk inisialisasi master data restoran, meja, menu, dan eksekusi 4 RPC functions ke Supabase. |
| [`src/features/kds/kds-actions.ts`](file:///c:/My_Koding/QuickDine/src/features/kds/kds-actions.ts) | **Branch-10** | 63 | **[BARU]** Server Actions KDS untuk update status pesanan dan siklus hidup meja otomatis. |
| [`supabase/schema.sql`](file:///c:/My_Koding/QuickDine/supabase/schema.sql) | **Branch-10** | 325 | Skema DDL master Supabase PostgreSQL dengan penambahan `telegram_chat_id` dan 2 RPC baru. |
| [`src/types/index.ts`](file:///c:/My_Koding/QuickDine/src/types/index.ts) | **Branch-10** | 126 | Interface TypeScript global terupdate dengan `telegram_chat_id`. |
| [`src/app/api/webhooks/midtrans/route.ts`](file:///c:/My_Koding/QuickDine/src/app/api/webhooks/midtrans/route.ts) | **Branch-10** | 154 | Webhook handler terintegrasi dengan kolom `telegram_chat_id` resto dan mapping `order_items` yang akurat. |

---

## Audit Kepatuhan Batas Baris (< 500 Baris)

- **Total File Kode Proyek:** 73 file
- **File Melebihi 500 Baris:** **0 File (100% Lolos Batas Aman)**
- **Verifikasi Build `npm run build`:** **0 Error (21/21 Rute Lolos Sukses)**
- **Status Database:** 100% Terhubung & Terisi Data Asli (*Connected & Seeded*).
