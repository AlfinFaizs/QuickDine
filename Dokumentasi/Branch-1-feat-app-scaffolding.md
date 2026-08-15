# 📘 Dokumentasi Branch-1: Scaffolding Rute & Halaman Login (`feat/app-scaffolding` & `feat/login-page`)

**Tanggal:** 15 Agustus 2026  
**Status:** Selesai & Ter-commit di Lokal  
**Branch:** `feat/app-scaffolding` ➡️ `feat/login-page`  
**Fokus Utama:** Implementasi arsitektur *Feature-Driven Modular Monolith*, penyusunan 15 rute Next.js App Router, implementasi antarmuka Login sesuai mock-up Stitch, dan penggantian favicon brand QuickDine.

---

## 1. Pilihan Pola Arsitektur: Feature-Driven Modular Monolith

Untuk memastikan proyek mudah dikembangkan oleh solo developer namun tetap memiliki isolasi domain layaknya microservices, dipilih struktur **Feature-Driven Architecture dipadukan dengan Route Groups Next.js**.

```text
quickdine/
├── Dokumentasi/                   # Catatan historis arsitektur & branch
│   ├── Branch-0-main-setup.md
│   └── Branch-1-feat-app-scaffolding.md
│
├── prisma/
│   ├── schema.prisma              # Definisi tabel DB & generator client
│   └── migrations/                # Riwayat migrasi Prisma
│
├── src/
│   ├── app/                       # Routing Pages & API (Next.js App Router)
│   │   ├── (marketing)/           # Group: Landing & Direktori Resto Publik
│   │   │   ├── layout.tsx         # Navbar publik & Footer
│   │   │   └── page.tsx           # Halaman utama direktori resto & pencarian (/)
│   │   │
│   │   ├── (customer)/            # Group: Alur Pemesanan Customer (Mobile First)
│   │   │   ├── [restoSlug]/
│   │   │   │   ├── page.tsx       # Katalog menu & denah meja interaktif (/[slug])
│   │   │   │   ├── checkout/
│   │   │   │   │   └── page.tsx   # Form bayar, timer lock 10m, non-refundable consent
│   │   │   │   └── order/[id]/
│   │   │   │       └── page.tsx   # Live tracking status masak & maps (/[slug]/order/[id])
│   │   │   └── pesanan-saya/
│   │   │       └── page.tsx       # Riwayat & daftar pesanan aktif customer
│   │   │
│   │   ├── (auth)/                # Group: Autentikasi Customer & Staf
│   │   │   └── login/
│   │   │       └── page.tsx       # Halaman Login/Register terpadu
│   │   │
│   │   ├── (dashboard)/           # Group: Portal Resto (Kasir, Koki, Owner)
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx     # Sidebar navigasi resto & status KDS online
│   │   │       ├── kds/page.tsx   # Kitchen Display System (Realtime Dapur)
│   │   │       ├── tables/page.tsx# Manajemen denah meja live (4 state penuh)
│   │   │       ├── menu/page.tsx  # CRUD Master Menu & toggle stok
│   │   │       ├── finance/page.tsx# Rekap omset & ekspor CSV payout H+1
│   │   │       └── settings/page.tsx# Jam operasional, nomor WA, input cook_trigger_minutes
│   │   │
│   │   ├── (super-admin)/         # Group: Platform Owner (Klien SaaS)
│   │   │   └── super-admin/
│   │   │       └── page.tsx       # Metrik GMV & laba platform fee
│   │   │
│   │   ├── api/                   # REST API & Webhooks
│   │   │   ├── webhooks/
│   │   │   │   └── midtrans/route.ts # Webhook Midtrans (Service Role Key)
│   │   │   └── cron/
│   │   │       └── cleanup-locks/route.ts # Cron unlock meja expired locks
│   │   │
│   │   ├── auth/
│   │   │   └── callback/route.ts  # Supabase Auth Magic Link Callback Handler
│   │   ├── icon.svg               # Favicon QuickDine Emerald Green
│   │   ├── globals.css            # Desain token Tailwind v4 & font Inter
│   │   └── providers.tsx          # QueryClient & Toaster Provider
│   │
│   ├── components/                # Komponen UI Global / Shared
│   │   ├── ui/                    # Primitives (button, input, badge, card)
│   │   └── shared/                # Layout bersama (Navbar, Footer)
│   │
│   ├── features/                  # Domain Business Logic (Feature-Based)
│   │   ├── orders/                # Logika Pesanan (actions.ts, schema.ts)
│   │   └── tables/                # Logika Denah Meja & Locking (actions.ts)
│   │
│   ├── services/                  # External Provider Integration (Adapter Pattern)
│   │   ├── notification/          # WhatsApp Service (fonnte.service.ts)
│   │   └── payment/               # Midtrans Snap Service & Fee Calculator
│   │
│   ├── lib/                       # Utility & Core Clients
│   │   ├── prisma.ts              # Prisma Client Singleton (PostgreSQL Adapter)
│   │   ├── utils.ts               # Format Rupiah, Helper Tailwind Class
│   │   └── supabase/              # Client, Server, Admin, Middleware
│   │
│   └── types/                     # Global TypeScript Definitions
│       └── index.ts               # TableStatus, OrderStatus, Restaurant, Order, dll.
```

---

## 2. Rincian Fitur & Modul yang Terbentuk

### A. Layanan Eksternal (Services Layer — Adapter Pattern)
1. **`src/services/payment/fee-calculator.ts`**: Menghitung biaya layanan platform dinamis:
   - QRIS: Biaya layanan customer Rp1.500.
   - Virtual Account (BCA, Mandiri, BRI, BNI): Biaya layanan customer Rp5.500.
2. **`src/services/payment/midtrans.service.ts`**: Request pembuatan Snap Token transaksi ke Midtrans API dan verifikasi SHA-512 Signature Key.
3. **`src/services/notification/fonnte.service.ts`**: Adapter WhatsApp Fonnte untuk mengirim notifikasi pesanan ke grup kasir, struk digital ke customer, dan rekap harian ke owner.

### B. Fitur Domain (`src/features/`)
1. **`src/features/tables/actions.ts`**: Server Action `lockTableAction` yang memanggil PostgreSQL RPC `lock_table_for_checkout` (mengunci meja secara atomik).
2. **`src/features/orders/schema.ts`**: Skema Zod untuk form validasi data checkout pemesan.
3. **`src/features/orders/actions.ts`**: Server Action `createOrderAction` untuk kalkulasi waktu grace period (15 menit server-side), penyimpanan order draft, dan inisiasi Midtrans Snap.

### C. Halaman Login (`src/app/(auth)/login/page.tsx`) — Sesuai Mockup Stitch
- **Layout:** Centered Card di atas canvas background `#faf8ff` dengan kartu putih `rounded-2xl` dan border halus.
- **Segmented Tab Switcher:**
  - **Tab Pelanggan (Default):** Menggunakan otentikasi **Magic Link OTP** (tanpa password). Customer memasukkan email ➡️ sistem mengirim tautan masuk instan.
  - **Tab Staf / Pemilik Resto:** Menggunakan otentikasi **Email + Kata Sandi** dengan toggle tombol tampilkan/sembunyikan password (`Eye` / `EyeOff`) untuk masuk ke dashboard resto.
- **Suspense Boundary:** Dibungkus dalam `<Suspense>` untuk memastikan kompatibilitas SSR saat membaca `searchParams` URL (misal `?next=/checkout`).

### D. Pembersihan Aset Boilerplate & Favicon Brand
- Menghapus aset default Next.js (`vercel.svg`, `next.svg`, `favicon.ico`).
- Membuat [`src/app/icon.svg`](file:///c:/My_Koding/QuickDine/src/app/icon.svg) berisi logo QuickDine asli (simbol sendok/garpu hijau Emerald `#006948`) yang otomatis dijadikan tab icon oleh Next.js.

---

## 3. Hasil Pengujian & Verifikasi Kompilasi

Perintah verifikasi build:
```bash
npm run build
```

**Hasil:**
- **Kompilasi TypeScript:** 0 Error (Lolos).
- **Rute yang Ter-generate (15 Rute):**
  - `/` (Marketing Landing & Resto Directory)
  - `/[restoSlug]` (Katalog Menu & Denah Meja)
  - `/[restoSlug]/checkout` (Form Checkout & Table Lock)
  - `/[restoSlug]/order/[id]` (Live Tracking Status Masak)
  - `/pesanan-saya` (Riwayat Pesanan Customer)
  - `/login` (Auth Login & Register)
  - `/dashboard/kds` (Kitchen Display System)
  - `/dashboard/tables` (Manajemen Meja Live Kasir)
  - `/dashboard/menu` (Master Menu & Varian)
  - `/dashboard/finance` (Laporan Keuangan & CSV Payout)
  - `/dashboard/settings` (Pengaturan Operasional Resto)
  - `/super-admin` (Super Admin Overview Platform)
  - `/auth/callback` (Auth Redirect Callback)
  - `/api/webhooks/midtrans` (Webhook Receiver)
  - `/api/cron/cleanup-locks` (Cron Unlock Meja Expired)

---

## 4. Riwayat Git Commit Lokal
```text
* 4b7e01d (HEAD -> feat/login-page) chore: replace default Next.js favicon and assets with QuickDine brand icon
* 9365bdf feat: polish login and register page with segmented tabs and magic link flow
* 9d7e5c6 (feat/app-scaffolding) feat: implement modular monolith architecture, route groups, and initial pages
* 0b3a71d (main) chore: setup project foundation with Next.js, Supabase, Prisma, and PRD v4.2
```
