# 📘 Dokumentasi Branch-0: Inisialisasi Proyek & Fondasi Sistem (`main`)

**Tanggal:** 15 Agustus 2026  
**Status:** Selesai & Ter-push ke GitHub (`main`)  
**Fokus Utama:** Setup inisialisasi framework, instalasi dependensi inti, konfigurasi database Supabase (DDL, RLS, RPC), singletons client/server, dan standardisasi aturan koding.
**Disusun Mengikuti PRD:** "PRD\PRD_QuickDine_PesanMeja_v3_Final.md"

---

## 1. Ikhtisar & Tujuan

Branch `main` adalah fondasi dasar platform SaaS **QuickDine / PesanMeja**. Pada tahap ini, dipersiapkan seluruh dependensi teknis, skrip inisialisasi basis data PostgreSQL, helper otentikasi Supabase, singletons ORM Prisma, serta aturan rekayasa perangkat lunak agar proses pembangunan fitur di branch-branch berikutnya berjalan lancar dan terisolasi.

---

## 2. Rincian File yang Dibuat & Dimodifikasi

### A. File Baru ([NEW])
1. [`supabase/schema.sql`](file:///c:/My_Koding/QuickDine/supabase/schema.sql) (327 baris)
   - **Peran:** Skema DDL 7 tabel inti, fungsi RPC atomik `lock_table_for_checkout`, Row Level Security (RLS) multi-tenant, dan indexes.
2. [`src/types/index.ts`](file:///c:/My_Koding/QuickDine/src/types/index.ts) (82 baris)
   - **Peran:** Tipe data global TypeScript (OrderStatus, TableStatus, Restaurant, Order, Cart, UserClaims).
3. [`src/lib/prisma.ts`](file:///c:/My_Koding/QuickDine/src/lib/prisma.ts) (25 baris)
   - **Peran:** Singleton Prisma Client v7 dengan driver adapter PostgreSQL (`@prisma/adapter-pg`).
4. [`src/lib/supabase/client.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/client.ts), [`server.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/server.ts), [`admin.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/admin.ts), [`middleware.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/middleware.ts)
   - **Peran:** Singletons factory untuk Supabase Browser, Server Cookies, Service Role Admin, dan Session Refresh Middleware.
5. [`src/services/notification/fonnte.service.ts`](file:///c:/My_Koding/QuickDine/src/services/notification/fonnte.service.ts) (48 baris)
   - **Peran:** Adapter notifikasi WhatsApp via Fonnte API.
6. [`src/services/payment/fee-calculator.ts`](file:///c:/My_Koding/QuickDine/src/services/payment/fee-calculator.ts) & [`midtrans.service.ts`](file:///c:/My_Koding/QuickDine/src/services/payment/midtrans.service.ts)
   - **Peran:** Kalkulator fee transaksi (QRIS Rp1.500 / VA Rp5.500) dan integrasi Midtrans Snap gateway.
7. [`src/features/tables/actions.ts`](file:///c:/My_Koding/QuickDine/src/features/tables/actions.ts) & [`src/features/orders/actions.ts`](file:///c:/My_Koding/QuickDine/src/features/orders/actions.ts)
   - **Peran:** Server Actions untuk pemanggilan RPC `lock_table_for_checkout` dan pembuatan order atomik.

### B. File yang Dimodifikasi ([MODIFIED])
1. [`AGENTS.md`](file:///c:/My_Koding/QuickDine/AGENTS.md)
   - **Perubahan:** Menambahkan aturan ketat batas baris file (<500 baris) dan arsitektur Feature-Driven Monolith.
2. [`src/app/globals.css`](file:///c:/My_Koding/QuickDine/src/app/globals.css) & [`src/app/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/layout.tsx)
   - **Perubahan:** Setup token desain Tailwind v4 Emerald Green (`#006948`), Google Font Inter, dan Providers.

---

## 3. Dependensi yang Dipasang

### A. Framework & Runtime

- **Next.js 16.3.1 (App Router)**: Framework fullstack React 19 dengan TypeScript.
- **Tailwind CSS v4**: Engine styling modern berbasis `@theme` tokens.

### B. Database & Otentikasi

- `@supabase/supabase-js` (v2.112.3) & `@supabase/ssr` (v0.12.4): Client SDK dan SSR cookie auth handlers.
- `prisma` (v7.9.1) & `@prisma/client`: ORM generasi ke-7.
- `@prisma/adapter-pg` & `pg`: Driver adapter PostgreSQL native untuk Prisma 7.

### C. State Management & Validasi Form

- `@tanstack/react-query` (v5.101.4): Data fetching, caching, dan server-state sync.
- `zustand` (v5.0.15): Client state management ringan.
- `react-hook-form` & `zod`: Validasi form tipe aman dan schema checking.

### D. UI Primitives & Utilities

- `lucide-react`: Library icon vektor modern.
- `sonner`: Sistem notifikasi toast modern.
- `clsx`, `tailwind-merge`, `class-variance-authority`: Helper composability class CSS.

---

## 3. Database Schema & Keamanan (`supabase/schema.sql`)

Seluruh skema database PostgreSQL disusun sesuai **PRD v4.2** dan disimpan pada file [`supabase/schema.sql`](file:///c:/My_Koding/QuickDine/supabase/schema.sql):

### 3.1 Struktur Tabel Inti (7 Tabel)

1. **`restaurants`**: Master data resto (multi-tenant), rekening payout, nomor WA, dan kolom `cook_trigger_minutes` (default 15 menit).
2. **`subscriptions`**: History paket langganan bulanan resto flat Rp200.000/bulan.
3. **`restaurant_tables`**: Data meja resto, kapasitas, unique constraint `(restaurant_id, table_number)`, dan 4 status meja (`vacant`, `locked`, `reserved`, `occupied`).
4. **`menu_items`**: Master menu, harga, toggle ketersediaan, dan JSONB `variants`.
5. **`orders`**: Header pesanan pelanggan, kolom `customer_user_id` (relasi ke `auth.users`), `arrival_time`, `grace_period_until` (dihitung server-side), status pembayaran, dan `payment_reference_id` (idempotency webhook).
6. **`order_items`**: Detail item pesanan (snapshot harga dan varian saat checkout).
7. **`balance_ledgers`**: Pembukuan saldo omset resto 100% utuh tanpa potongan komisi makanan.

### 3.2 Row Level Security (RLS) & Helper Functions

- `auth_restaurant_id()` & `auth_role()`: Ekstraksi custom claim JWT dari `app_metadata`.
- RLS Policy untuk memastikan isolasi antar resto (Kasir Resto A tidak dapat melihat Resto B) dan customer hanya dapat mengakses order miliknya sendiri (`customer_user_id = auth.uid()`).

### 3.3 Fungsi Atomik PostgreSQL (RPC)

- **`lock_table_for_checkout`**: Mengunci meja secara atomik (`VACANT → LOCKED`) selama 10 menit menggunakan `SECURITY DEFINER` untuk mencegah race condition antar customer.
- **`cleanup_expired_locks`**: Membersihkan meja yang melewati batas `locked_until` kembali menjadi `VACANT`.

---

## 4. Helper & Singletons Inti (`src/lib/`)

- [`src/lib/utils.ts`](file:///c:/My_Koding/QuickDine/src/lib/utils.ts): Helper `cn()` dan `formatRupiah()`.
- [`src/lib/prisma.ts`](file:///c:/My_Koding/QuickDine/src/lib/prisma.ts): Singleton Prisma Client dengan `@prisma/adapter-pg`.
- [`src/lib/supabase/client.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/client.ts): Factory browser client Supabase.
- [`src/lib/supabase/server.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/server.ts): Factory server client Supabase berbasis `cookies()`.
- [`src/lib/supabase/admin.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/admin.ts): Client dengan `SERVICE_ROLE_KEY` untuk webhook pembayaran.
- [`src/lib/supabase/middleware.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/middleware.ts) & [`src/middleware.ts`](file:///c:/My_Koding/QuickDine/src/middleware.ts): Proteksi rute otomatis (`/dashboard/*`, `/super-admin/*`, `/pesanan-saya`).
- [`src/app/providers.tsx`](file:///c:/My_Koding/QuickDine/src/app/providers.tsx): Provider global untuk TanStack Query Client dan Toaster.

---

## 5. Design Tokens & Styling Dasar

- **Brand Color:** Emerald Green Primary (`#006948`), Accent Amber (`#fea619`), Background Canvas (`#faf8ff`), Dark Slate Typography (`#131b2e`).
- **Font:** Google Font _Inter_.
- **Konfigurasi:** Terpasang di [`src/app/globals.css`](file:///c:/My_Koding/QuickDine/src/app/globals.css) dan [`src/app/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/layout.tsx).

---

## 6. Aturan Proyek di [`AGENTS.md`](file:///c:/My_Koding/QuickDine/AGENTS.md)

1. **Panjang Baris per File:** Wajib di bawah 500 baris untuk menjaga modularitas dan kemudahan pemeliharaan (_Single Responsibility Principle_).
2. **Arsitektur:** Feature-Driven Architecture (Modular Monolith) dipadukan dengan Route Groups Next.js.
3. **Desain:** Mengacu pada design system "Emerald Efficiency" dan mockups Stitch.

---

## 7. Peta Struktur & Arsitektur Lengkap Proyek

Peta struktur master proyek, diagram alur data antar-layer, dan kamus seluruh file kode telah dipisahkan ke dalam dokumen terpusat khusus:

👉 **Lihat Dokumen Master:** [`Dokumentasi/Peta-Struktur.md`](file:///c:/My_Koding/QuickDine/Dokumentasi/Peta-Struktur.md)

Dokumen tersebut memuat:
- **Peta Kasar Folder (ASCII Tree Map)** dari level root hingga file leaf.
- **Kamus Lengkap File Proyek:** Tabel seluruh file, fungsi utama, branch asal, dan audit batas panjang baris (<500 baris).
- **Data Flow Architecture:** Diagram visual interaksi dari Presentation Layer ➡️ Domain Feature ➡️ Service Layer ➡️ PostgreSQL DB.

---

## 8. Status Riwayat Git Commit
```text
* 9d7e5c6 (feat/app-scaffolding) feat: implement modular monolith architecture, route groups, and initial pages
* 0b3a71d (origin/main, main) chore: setup project foundation with Next.js, Supabase, Prisma, and PRD v4.2
* c0629e3 Initial commit from Create Next App
```

