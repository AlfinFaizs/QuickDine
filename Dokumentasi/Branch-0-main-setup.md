# 📘 Dokumentasi Branch-0: Inisialisasi Proyek & Fondasi Sistem (`main`)

**Tanggal:** 15 Agustus 2026  
**Status:** Selesai & Ter-push ke GitHub (`main`)  
**Fokus Utama:** Setup inisialisasi framework, instalasi dependensi inti, konfigurasi database Supabase (DDL, RLS, RPC), singletons client/server, dan standardisasi aturan koding.

---

## 1. Ikhtisar & Tujuan

Branch `main` adalah fondasi dasar platform SaaS **QuickDine / PesanMeja**. Pada tahap ini, dipersiapkan seluruh dependensi teknis, skrip inisialisasi basis data PostgreSQL, helper otentikasi Supabase, singletons ORM Prisma, serta aturan rekayasa perangkat lunak agar proses pembangunan fitur di branch-branch berikutnya berjalan lancar dan terisolasi.

---

## 2. Dependensi yang Dipasang

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
- **Font:** Google Font *Inter*.
- **Konfigurasi:** Terpasang di [`src/app/globals.css`](file:///c:/My_Koding/QuickDine/src/app/globals.css) dan [`src/app/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/layout.tsx).

---

## 6. Aturan Proyek di [`AGENTS.md`](file:///c:/My_Koding/QuickDine/AGENTS.md)
1. **Panjang Baris per File:** Wajib di bawah 500 baris untuk menjaga modularitas dan kemudahan pemeliharaan (*Single Responsibility Principle*).
2. **Arsitektur:** Feature-Driven Architecture (Modular Monolith) dipadukan dengan Route Groups Next.js.
3. **Desain:** Mengacu pada design system "Emerald Efficiency" dan mockups Stitch.

---

## 7. Status Git Commit
```text
commit 0b3a71d (origin/main, main)
Author: Antigravity Assistant
Message: chore: setup project foundation with Next.js, Supabase, Prisma, and PRD v4.2
```
