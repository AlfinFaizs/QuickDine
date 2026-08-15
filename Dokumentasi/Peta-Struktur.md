# Peta Struktur Folder & Arsitektur Proyek QuickDine

Dokumen ini berisi **peta struktur folder, pembagian domain arsitektur, dan alur data modular** pada repositori **QuickDine** per Agustus 2026 (pasca **Branch-0 s/d Branch-5: Dashboard KDS & Tables**).

Proyek ini mengadopsi arsitektur **Feature-Driven Modular Monolith** dipadukan dengan **Route Groups Next.js 16 (App Router)** untuk memastikan skalabilitas tinggi, kemudahan pelacakan kode, dan isolasi domain yang rapi bagi developer maupun tim.

> **Kamus Lengkap File Proyek:** Untuk rincian ensiklopedis setiap file kode (peran, fungsi, baris, dan branch asal), silakan buka dokumen khusus:  
> [Dokumentasi/Kamus-File.md](file:///c:/My_Koding/QuickDine/Dokumentasi/Kamus-File.md)

---

## 1. Peta Struktur Folder (ASCII Tree Map)

```text
QuickDine/
├── Dokumentasi/                              // Catatan historis branch & peta arsitektur
│   ├── Branch-0-main-setup.md                // Dokumentasi fondasi proyek & setup DB
│   ├── Branch-1-feat-login-page.md           // Dokumentasi login Google, customer, staf
│   ├── Branch-2-feat-partner-registration.md // Dokumentasi onboarding mitra & 11 resto
│   ├── Branch-3-feat-customer-ordering.md    // Dokumentasi alur katalog, meja & checkout
│   ├── Branch-4-feat-landing-and-explore-page.md // Dokumentasi redesign landing & halaman /jelajah
│   ├── Branch-5-feat-dashboard-kds-and-tables.md // Dokumentasi KDS dapur & denah meja kasir
│   ├── Kamus-File.md                         // [ENSIKLOPEDIA] Kamus detail 48+ file kode
│   └── Peta-Struktur.md                      // [DOKUMEN INI] Peta struktur master pohon folder
│
├── prisma/                                   // ORM & Database schema generator
│   └── schema.prisma                         // Definisi model database Prisma v7
│
├── public/                                   // Static assets publik
│   ├── favicon.ico                           // Favicon browser
│   ├── icon.png                              // Shield brand icon transparan (resmi)
│   └── images/
│       └── logo.png                          // Master asset logo QuickDine
│
├── src/
│   ├── app/                                  // Next.js App Router (Route Groups)
│   │   ├── (marketing)/                      // PORTAL PUBLIK & MARKETING
│   │   │   ├── layout.tsx                    // Navbar & Footer publik wrapper
│   │   │   ├── page.tsx                      // Landing page marketing (Cara Kerja, 4 featured, B2B)
│   │   │   └── daftar-mitra/
│   │   │       └── page.tsx                  // 4-Step wizard pendaftaran mitra resto
│   │   │
│   │   ├── (customer)/                       // ALUR PEMESANAN CUSTOMER (Mobile First)
│   │   │   ├── jelajah/
│   │   │   │   └── page.tsx                  // Shell Suspense wrapper halaman katalog /jelajah
│   │   │   ├── [restoSlug]/
│   │   │   │   ├── page.tsx                  // Katalog resto, live table map, varian modal
│   │   │   │   ├── checkout/
│   │   │   │   │   └── page.tsx              // Form checkout, timer 10m, jam tiba, bayar
│   │   │   │   └── order/[id]/
│   │   │   │       └── page.tsx              // Live tracking status masak & Google Maps
│   │   │   └── pesanan-saya/
│   │   │       └── page.tsx                  // Riwayat & status pesanan aktif customer
│   │   │
│   │   ├── (auth)/                           // OTENTIKASI PENGGUNA TERPADU
│   │   │   └── login/
│   │   │       └── page.tsx                  // Login Google 1-click, register, & staf portal
│   │   │
│   │   ├── (dashboard)/                      // PORTAL OPERASIONAL RESTO & MITRA
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx                // Sidebar navigasi resto & header mobile
│   │   │       ├── kds/page.tsx              // Kitchen Display System (Realtime Dapur)
│   │   │       ├── tables/page.tsx           // Kontrol live denah meja kasir (4 state)
│   │   │       ├── menu/page.tsx             // CRUD master menu makanan & toggle stok
│   │   │       ├── finance/page.tsx          // Rekap omset bersih & payout bank H+1
│   │   │       └── settings/page.tsx         // Pengaturan jam operasional & cook time
│   │   │
│   │   ├── (super-admin)/                    // PORTAL SUPER ADMIN PLATFORM
│   │   │   └── super-admin/
│   │   │       ├── layout.tsx                // Sidebar kiri Super Admin, logo & navigasi
│   │   │       ├── page.tsx                  // Executive KPI Dashboard & transaksi live
│   │   │       ├── verifikasi/page.tsx       // Khusus antrean verifikasi pendaftar baru
│   │   │       ├── tenants/page.tsx          // Khusus direktori seluruh mitra restoran
│   │   │       └── payouts/page.tsx          // Khusus monitoring transfer payout bank H+1
│   │   │
│   │   ├── api/                              // REST API & WEBHOOKS
│   │   │   ├── cron/cleanup-locks/route.ts   // Cron un-lock meja expired (>10 mnt)
│   │   │   └── webhooks/midtrans/route.ts    // Webhook verifikasi pembayaran Midtrans
│   │   │
│   │   ├── auth/callback/route.ts            // Handler callback OAuth Google & Magic Link
│   │   ├── apple-icon.png                    // Icon iOS WebClip
│   │   ├── icon.png                          // Tab browser icon
│   │   ├── globals.css                       // Desain token Emerald Tailwind CSS v4
│   │   ├── layout.tsx                        // Root layout HTML & Font Inter
│   │   └── providers.tsx                     // TanStack Query & Toaster provider
│   │
│   ├── components/                           // KOMPONEN UI GLOBAL & SHARED
│   │   ├── shared/                           // Komponen layout & modul bersama
│   │   │   ├── brand-logo.tsx                // Logo resmi QuickDine responsif
│   │   │   ├── footer.tsx                    // Footer halaman publik
│   │   │   ├── google-icon.tsx               // SVG ikon Google 1-click
│   │   │   ├── navbar.tsx                    // Navbar cerdas (deteksi sesi login)
│   │   │   └── password-checklist.tsx        // Visual checklist indikator password
│   │   └── ui/                               // UI Primitives (Design System)
│   │       ├── badge.tsx                     // Komponen status badge
│   │       ├── button.tsx                    // Komponen tombol kustom
│   │       ├── card.tsx                      // Kontainer kartu modular
│   │       ├── confirm-dialog.tsx            // Dialog konfirmasi 2-langkah aksi krusial/destruktif
│   │       ├── input.tsx                     // Input form standar
│   │       └── skeleton.tsx                  // Primitive shimmer skeleton loader pulse
│   │
│   ├── features/                             // LOGIKA BISNIS PER DOMAIN (Feature-Based)
│   │   ├── finance/                          // Modul Keuangan & Ledger Omset Restoran
│   │   │   ├── finance-data.ts               // Tipe data transaksi & ringkasan omset
│   │   │   ├── finance-kpi-cards.tsx         // 4 Kartu KPI metrik omset & payout
│   │   │   └── finance-ledger-table.tsx      // Tabel buku kas transaksi & rincian fee
│   │   │
│   │   ├── kds/                              // Modul Kitchen Display System (Dapur)
│   │   │   ├── kds-data.ts                   // Tipe data & mock order dapur realtime
│   │   │   ├── kds-header-stats.tsx          // Bar metrik 4 status order dapur
│   │   │   ├── kds-order-card.tsx            // Kartu pesanan dapur + alarm & grace timer
│   │   │   └── kds-skeleton.tsx              // Skeleton shimmer loader antrean kartu KDS
│   │   │
│   │   ├── menu/                             // Modul Manajemen Master Menu & Varian
│   │   │   ├── menu-card.tsx                 // Kartu hidangan + Out-of-Stock switch toggle
│   │   │   ├── menu-data.ts                  // Tipe data menu, opsi varian, & mock items
│   │   │   ├── menu-form-modal.tsx           // Modal tambah & edit menu hidangan
│   │   │   └── menu-variant-modal.tsx        // Modal pengatur opsi varian & ekstra topping
│   │   │
│   │   ├── orders/                           // Modul Pesanan & Keranjang Belanja
│   │   │   ├── actions.ts                    // Server actions pembuatan order atomik
│   │   │   ├── cart-store.ts                 // Zustand store keranjang belanja customer
│   │   │   ├── floating-cart-bar.tsx         // Sticky bar melayang informasi pesanan
│   │   │   └── schema.ts                     // Skema validasi Zod pesanan
│   │   │
│   │   ├── partner/                          // Modul Onboarding Mitra Resto
│   │   │   └── actions.ts                    // Server action pendaftaran resto & owner
│   │   │
│   │   ├── restaurants/                      // Modul Restoran & Katalog Menu
│   │   │   ├── jelajah-content.tsx           // Konten /jelajah: search, filter, sort, grid
│   │   │   ├── menu-variant-modal.tsx        // Pop-up varian makanan & catatan koki
│   │   │   ├── mock-data.ts                  // Data direktori 11 restoran Indonesia
│   │   │   ├── restaurant-details-data.ts    // Data detail menu, opsi, & meja per resto
│   │   │   ├── resto-card-skeleton.tsx       // Skeleton shimmer kartu katalog restoran
│   │   │   └── table-map.tsx                 // Visual denah meja interaktif customer
│   │   │
│   │   ├── super-admin/                      // Modul Platform Super Admin & Tenant Verifier
│   │   │   ├── super-admin-data.ts           // Tipe data & mock dataset mitra & GMV nasional
│   │   │   ├── super-admin-kpi-cards.tsx     // 4 Kartu KPI eksekutif platform
│   │   │   ├── tenant-approval-queue.tsx     // Antrean verifikasi calon mitra pendaftar baru
│   │   │   └── tenant-directory-table.tsx    // Tabel direktori mitra & toggle suspend/active
│   │   │
│   │   └── tables/                           // Modul Manajemen Meja Resto & Kasir
│   │       ├── actions.ts                    // Server actions RPC table locking
│   │       ├── table-card.tsx                // Kartu meja individual denah kasir
│   │       ├── table-detail-modal.tsx        // Modal pop-up aksi check-in, no-show, clear
│   │       ├── table-walkin-modal.tsx        // Modal input walk-in offline tamu
│   │       ├── tables-data.ts                // Tipe data & mock denah meja kasir
│   │       └── tables-skeleton.tsx           // Skeleton shimmer loader denah meja kasir
│   │
│   ├── services/                             // INTEGRASI PIHAK KETIGA (Adapter Pattern)
│   │   ├── notification/                     // Layanan Notifikasi WhatsApp
│   │   │   ├── fonnte.service.ts             // Adapter Fonnte WA Gateway
│   │   │   ├── index.ts                      // Factory instance notifikasi
│   │   │   └── notification.interface.ts     // Kontrak antarmuka notifikasi
│   │   └── payment/                          // Layanan Payment Gateway
│   │       ├── fee-calculator.ts             // Kalkulator fee QRIS (Rp1.500) & VA (Rp5.500)
│   │       └── midtrans.service.ts           // Adapter Midtrans Snap API
│   │
│   ├── lib/                                  // UTILITY & SINGLETON CORE
│   │   ├── excel-export.ts                   // Generator berkas Microsoft Excel (.xlsx) resmi
│   │   ├── image-compressor.ts               // Auto-crop & kompresi foto makanan ke 800x800 px (<100KB)
│   │   ├── prisma.ts                         // Singleton Prisma Client v7 (@prisma/adapter-pg)
│   │   ├── sanitize.ts                       // Utility sanitasi input & pencegahan XSS
│   │   ├── utils.ts                          // Helper formatting Rupiah & clsx merge
│   │   └── supabase/                         // Konfigurasi Supabase
│   │       ├── admin.ts                      // Service Role Client (bypass RLS / webhooks)
│   │       ├── client.ts                     // Browser Client (Public Anon Key)
│   │       ├── middleware.ts                 // Session refresh & route guard
│   │       └── server.ts                     // Server Component / Server Action Client
│   │
│   ├── types/                                // DEFINISI TIPE GLOBAL TYPESCRIPT
│   │   └── index.ts                          // OrderStatus, TableStatus, Restaurant, dll.
│   │
│   └── proxy.ts                              // Edge Network Proxy / Auth Middleware (Konvensi Next.js 16)
│
├── supabase/                                 // STRUKTUR DATABASE POSTGRESQL
│   └── schema.sql                            // DDL 7 tabel, fungsi RPC atomik, RLS policies
│
├── AGENTS.md                                 // Panduan dan aturan koding AI pair-programming
├── package.json                              // Definisi dependensi & skrip proyek
└── tsconfig.json                             // Konfigurasi compiler TypeScript
```

---

## 2. Hubungan Antar Lapisan Arsitektur (Data Flow)

Sistem QuickDine memisahkan tanggung jawab menjadi 4 lapisan terisolasi:

```text
[ Browser / Customer / Resto Staff ]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ 1. Presentation Layer (Next.js 16 App Router)          │
│    • app/(marketing)   → Marketing & Konversi (Landing, B2B Banner)  │
│    • app/(customer)    → Jelajah, Katalog, Meja, Checkout, Tracking   │
│    • app/(dashboard)   → Portal Resto, KDS, & Kasir    │
│    • app/(auth)        → Login Google & Staf Portal    │
│    • app/api           → Cron & Midtrans Webhooks      │
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ 2. Domain Feature Layer (Feature-Driven Architecture)  │
│    • features/orders   → Cart Store, Zod Schema, Action│
│    • features/partner  → Tenant Onboarding Logic       │
│    • features/tables   → Locking & Status Table Actions│
│    • features/restaurants → Mock Data & Table Map UI   │
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ 3. Service Layer (External Integrations / Adapters)    │
│    • services/payment      → Midtrans Snap & Fee Calc  │
│    • services/notification → WhatsApp Gateway (Fonnte) │
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ 4. Data & Persistence Layer (Database & Security)      │
│    • Supabase PostgreSQL   → 7 Tabel Inti & RPC Locking│
│    • Row Level Security    → Multi-Tenant Isolation    │
│    • Prisma Client v7      → Type-Safe Database Access │
└────────────────────────────────────────────────────────┘
```

---

## 3. Panduan Pemeliharaan & Aturan Rekayasa

1. **Batas Panjang File:** Setiap file kode wajib di bawah **500 baris** (*Single Responsibility Principle*).
2. **Kamus File Terpusat:** Setiap penambahan file baru di branch baru wajib dicatat ke [Dokumentasi/Kamus-File.md](file:///c:/My_Koding/QuickDine/Dokumentasi/Kamus-File.md).
3. **Pemisahan Logika:** Domain logic selalu ditaruh di `src/features/[feature]/` dan integrasi eksternal selalu menggunakan pola adapter di `src/services/[service]/`.
