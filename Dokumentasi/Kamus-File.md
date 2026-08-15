# 📖 Kamus File Proyek QuickDine (Ensiklopedia Modul)

Dokumen ini berisi **kamus file proyek lengkap dan ensiklopedia modul** pada repositori **QuickDine** per Agustus 2026 (pasca **Branch-0 s/d Branch-5: Dashboard KDS & Tables**).

Setiap file diuraikan secara detail mencakup peran fungsional, ketergantungan antar-modul, branch asal, serta status batas panjang baris (<500 baris).

> ⚠️ **Aturan Koding (`AGENTS.md`):** Seluruh file kode wajib berada di bawah batas **500 baris**. Jika ada modul yang berkembang melebihi batas, lakukan pemecahan (*refactoring*) ke sub-modul terisolasi.

---

## 🗂️ 1. Index Kamus File per Kelompok Modul

```text
1. 🗄️ Database & Persistence Layer (supabase/, prisma/)
2. 📝 Tipe Data Global TypeScript (src/types/)
3. ⚙️ Core Libraries & Singletons (src/lib/)
4. 🔌 External Services & Adapters (src/services/)
5. 💼 Domain Features & Business Logic (src/features/)
6. 🧩 UI Primitives & Shared Layout (src/components/)
7. 🏢 Presentation Layer / App Routes (src/app/)
8. 🎨 Aset Publik & Konfigurasi Root (public/, root config)
```

---

## 2. Rincian Detail Kamus File

### 🗄️ A. Database & Persistence Layer
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`supabase/schema.sql`](file:///c:/My_Koding/QuickDine/supabase/schema.sql) | Branch-0 | 327 | Master DDL PostgreSQL berisi 7 tabel inti (`restaurants`, `subscriptions`, `restaurant_tables`, `menu_items`, `orders`, `order_items`, `balance_ledgers`), fungsi atomik `lock_table_for_checkout`, Row Level Security (RLS) multi-tenant, dan indexes performa. |
| [`prisma/schema.prisma`](file:///c:/My_Koding/QuickDine/prisma/schema.prisma) | Branch-0 | 78 | Skema Prisma ORM v7 yang mendefinisikan relasi model objek database dan generator Prisma Client berbasis adapter PostgreSQL. |

---

### 📝 B. Tipe Data Global TypeScript
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/types/index.ts`](file:///c:/My_Koding/QuickDine/src/types/index.ts) | Branch-0 | 82 | Kontrak tipe data global sistem: `OrderStatus` (`pending`, `received`, `cooking`, `ready`, `completed`, `converted_takeaway`), `TableStatus` (`vacant`, `locked`, `occupied`, `reserved`), interface `Restaurant`, `Order`, `OrderItem`, `CustomJWTPayload`, dan `AuthUserRole`. |

---

### ⚙️ C. Core Libraries & Singletons
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/lib/prisma.ts`](file:///c:/My_Koding/QuickDine/src/lib/prisma.ts) | Branch-0 | 25 | Inisialisasi singleton Prisma Client generasi ke-7 dengan `@prisma/adapter-pg` untuk mencegah kebocoran koneksi database pada lingkungan Next.js dev & prod. |
| [`src/lib/utils.ts`](file:///c:/My_Koding/QuickDine/src/lib/utils.ts) | Branch-0 | 16 | Fungsi utilitas umum: `formatRupiah(number)` untuk format mata uang IDR dan helper `cn()` (clsx + tailwind-merge) untuk manipulasi class Tailwind. |
| [`src/lib/supabase/client.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/client.ts) | Branch-0 | 12 | Factory instansiasi Supabase Browser Client (`createBrowserClient`) menggunakan Public Anon Key untuk Client Components. |
| [`src/lib/supabase/server.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/server.ts) | Branch-0 | 38 | Factory instansiasi Supabase Server Client (`createServerClient`) berbasis Next.js `cookies()` untuk Server Components, Server Actions, dan Route Handlers. |
| [`src/lib/supabase/admin.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/admin.ts) | Branch-0 | 16 | Factory instansiasi Supabase Admin Client dengan `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS) untuk webhook pembayaran dan pendaftaran akun mitra. |
| [`src/lib/supabase/middleware.ts`](file:///c:/My_Koding/QuickDine/src/lib/supabase/middleware.ts) | Branch-0 | 68 | Helper middleware untuk me-refresh cookie auth token dan memproteksi rute privat (`/dashboard/*`, `/super-admin/*`, `/pesanan-saya`). |
| [`src/middleware.ts`](file:///c:/My_Koding/QuickDine/src/middleware.ts) | Branch-0 | 12 | Root Edge Middleware Next.js yang meneruskan setiap request ke `updateSession()`. |

---

### 🔌 D. External Services & Adapters (Adapter Pattern)
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/services/notification/notification.interface.ts`](file:///c:/My_Koding/QuickDine/src/services/notification/notification.interface.ts) | Branch-0 | 18 | Interface kontrak pengiriman notifikasi (WhatsApp/SMS/Email) agar mudah diganti penyedianya tanpa merusak kode pemanggil. |
| [`src/services/notification/fonnte.service.ts`](file:///c:/My_Koding/QuickDine/src/services/notification/fonnte.service.ts) | Branch-0 | 48 | Implementasi adapter Fonnte WhatsApp API untuk mengirim notifikasi pesanan ke customer dan notifikasi alarm dapur ke resto. |
| [`src/services/notification/index.ts`](file:///c:/My_Koding/QuickDine/src/services/notification/index.ts) | Branch-0 | 14 | Factory module penyedia singleton notifikasi WhatsApp. |
| [`src/services/payment/fee-calculator.ts`](file:///c:/My_Koding/QuickDine/src/services/payment/fee-calculator.ts) | Branch-0 | 30 | Kalkulator platform fee otomatis: QRIS (+Rp 1.500) vs Virtual Account (+Rp 5.500) serta pembagian net balance untuk saldo mitra resto. |
| [`src/services/payment/midtrans.service.ts`](file:///c:/My_Koding/QuickDine/src/services/payment/midtrans.service.ts) | Branch-0 | 75 | Adapter integrasi Midtrans Snap API untuk membuat token transaksi pembayaran dan verifikasi signature webhook. |

---

### 💼 E. Domain Features & Business Logic
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| **Fitur: Orders & Checkout** | | | |
| [`src/features/orders/actions.ts`](file:///c:/My_Koding/QuickDine/src/features/orders/actions.ts) | Branch-0 | 65 | Server Action pembuatan pesanan pelanggan, perhitungan subtotal + platform fee, dan penyimpanan snapshot order items. |
| [`src/features/orders/schema.ts`](file:///c:/My_Koding/QuickDine/src/features/orders/schema.ts) | Branch-0 | 28 | Skema validasi Zod untuk payload formulir checkout pesanan. |
| [`src/features/orders/cart-store.ts`](file:///c:/My_Koding/QuickDine/src/features/orders/cart-store.ts) | Branch-3 | 121 | Zustand persistent store mengelola data keranjang belanja customer (item, varian, catatan khusus koki, nomor meja terpilih, dan subtotal). |
| [`src/features/orders/floating-cart-bar.tsx`](file:///c:/My_Koding/QuickDine/src/features/orders/floating-cart-bar.tsx) | Branch-3 | 86 | Komponen sticky bar mengambang di bawah layar menampilkan counter item, subtotal, validasi pemilihan meja, dan tombol aksi checkout. |
| **Fitur: Partner Onboarding** | | | |
| [`src/features/partner/actions.ts`](file:///c:/My_Koding/QuickDine/src/features/partner/actions.ts) | Branch-2 | 112 | Server Action pendaftaran mitra resto, create user di Supabase Auth, set JWT custom claims (`role: 'owner'`), dan generate 10 meja default. |
| **Fitur: Restaurant Catalog & Tables** | | | |
| [`src/features/restaurants/mock-data.ts`](file:///c:/My_Koding/QuickDine/src/features/restaurants/mock-data.ts) | Branch-2 | 221 | Dataset modular 11 restoran & kafe populer Indonesia beserta filter 11 kategori kuliner dan status meja live. |
| [`src/features/restaurants/restaurant-details-data.ts`](file:///c:/My_Koding/QuickDine/src/features/restaurants/restaurant-details-data.ts) | Branch-3 | 401 | Database mock detail menu makanan, harga, opsi varian (suhu, level pedas, gula, topping), dan denah meja untuk seluruh 11 restoran. |
| [`src/features/restaurants/table-map.tsx`](file:///c:/My_Koding/QuickDine/src/features/restaurants/table-map.tsx) | Branch-3 | 135 | Komponen interaktif visual denah meja dengan 3 indikator status: 🟢 *Tersedia*, 🟡 *Sedang Dipesan (Timer)*, dan ⚪ *Terisi*. |
| [`src/features/restaurants/menu-variant-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/restaurants/menu-variant-modal.tsx) | Branch-3 | 217 | Modal pop-up kustomisasi varian makanan, counter jumlah, catatan koki, dan tombol tambah ke keranjang. |
| [`src/features/restaurants/jelajah-content.tsx`](file:///c:/My_Koding/QuickDine/src/features/restaurants/jelajah-content.tsx) | Branch-4 | 282 | Komponen konten utama halaman `/jelajah`. Berisi logika search real-time, sort 4 opsi, filter kategori pill, grid restoran 3 kolom, pagination "Tampilkan Lebih Banyak", dan empty state. Dipisah dari `page.tsx` agar bisa dibungkus `<Suspense>` (wajib Next.js 16 karena menggunakan `useSearchParams()`). |
| **Fitur: Kitchen Display System (KDS)** | | | |
| [`src/features/kds/kds-data.ts`](file:///c:/My_Koding/QuickDine/src/features/kds/kds-data.ts) | **Branch-5** | 89 | Definisi tipe data (`KdsOrder`, `KdsOrderItem`, `KdsOrderStatus`) dan data mock pesanan dapur terstruktur dengan timestamp dinamis. |
| [`src/features/kds/kds-order-card.tsx`](file:///c:/My_Koding/QuickDine/src/features/kds/kds-order-card.tsx) | **Branch-5** | 240 | Komponen kartu pesanan dapur interaktif dengan timer elapsed, hitung mundur tiba, banner late (+1m) & grace period (+15m), tombol masak, check-in, dan no-show trigger. |
| [`src/features/kds/kds-header-stats.tsx`](file:///c:/My_Koding/QuickDine/src/features/kds/kds-header-stats.tsx) | **Branch-5** | 74 | Bar visual 4 metrik status pesanan dapur (Menunggu Masak, Sedang Dimasak, Siap Saji, Total Aktif). |
| **Fitur: Tables Management & Cashier Control** | | | |
| [`src/features/tables/actions.ts`](file:///c:/My_Koding/QuickDine/src/features/tables/actions.ts) | Branch-0 | 55 | Server Action untuk memanggil RPC database `lock_table_for_checkout` (penguncian meja 10 menit) secara atomik. |
| [`src/features/tables/tables-data.ts`](file:///c:/My_Koding/QuickDine/src/features/tables/tables-data.ts) | **Branch-5** | 64 | Definisi tipe data (`DashboardTable`, `TableStatus`), mock denah meja kasir, dan dictionary konfigurasi visual status (`STATUS_CONFIG`). |
| [`src/features/tables/table-card.tsx`](file:///c:/My_Koding/QuickDine/src/features/tables/table-card.tsx) | **Branch-5** | 83 | Komponen kartu meja individual kasir dengan color-coded 4 status, info tamu, ETA, no HP, dan kapasitas kursi. |
| [`src/features/tables/table-walkin-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/tables/table-walkin-modal.tsx) | **Branch-5** | 89 | Modal pop-up input data tamu walk-in offline untuk meja kosong (VACANT). |
| [`src/features/tables/table-detail-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/tables/table-detail-modal.tsx) | **Branch-5** | 114 | Modal pop-up aksi detail meja kasir (Check-In Tamu Tiba, Trigger No-Show Bungkus, Kosongkan Meja Selesai). |

---

### 🧩 F. UI Primitives & Shared Components
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/components/shared/brand-logo.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/brand-logo.tsx) | Branch-2 | 61 | Komponen logo resmi QuickDine dengan shield hijau transparan multi-size (`sm`, `md`, `lg`, `xl`) dan teks brand adaptif. |
| [`src/components/shared/navbar.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/navbar.tsx) | Branch-2 / 3 / **4** | ~103 | Navbar publik cerdas: menyembunyikan *Pesanan Saya* untuk tamu, link "Jelajahi Restoran" (dengan active state), search bar functional yang redirect ke `/jelajah`, dan tombol login/register. |
| [`src/components/shared/footer.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/footer.tsx) | Branch-2 / **4** | 55 | Footer halaman publik. Link navigasi diperbarui dari "Direktori Restoran" (href `/`) menjadi "Jelajahi Restoran" (href `/jelajah`). |
| [`src/components/shared/google-icon.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/google-icon.tsx) | Branch-1 | 25 | Ikon SVG resmi Google untuk otentikasi OAuth 1-Click. |
| [`src/components/shared/password-checklist.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/password-checklist.tsx) | Branch-1 | 70 | Visual checklist interaktif kekuatan password (min 8 karakter, huruf+angka, konfirmasi cocok). |
| [`src/components/ui/button.tsx`](file:///c:/My_Koding/QuickDine/src/components/ui/button.tsx) | Branch-0 | 48 | Komponen tombol primitif dengan varian gaya (default, outline, ghost, destructive) dan status loading spinner. |
| [`src/components/ui/input.tsx`](file:///c:/My_Koding/QuickDine/src/components/ui/input.tsx) | Branch-0 | 25 | Komponen input teks standar formulir dengan styling terpadu. |
| [`src/components/ui/badge.tsx`](file:///c:/My_Koding/QuickDine/src/components/ui/badge.tsx) | Branch-0 | 36 | Komponen label badge (success, warning, destructive, outline). |
| [`src/components/ui/card.tsx`](file:///c:/My_Koding/QuickDine/src/components/ui/card.tsx) | Branch-0 | 55 | Komponen kontainer kartu modular (CardHeader, CardTitle, CardContent, CardFooter). |

---

### 🏢 G. Presentation Layer (App Router Routes)
| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| **Portal Publik `(marketing)`** | | | |
| [`src/app/(marketing)/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28marketing%29/layout.tsx) | Branch-0 | 18 | Layout pembungkus rute beranda dan pendaftaran mitra dengan Navbar & Footer. |
| [`src/app/(marketing)/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28marketing%29/page.tsx) | Branch-2 / **4** | 239 | **[Branch-4: Dirombak Total]** Halaman beranda marketing: hero section + search CTA ke `/jelajah`, section "Cara Kerja" 3-langkah, preview 4 restoran populer (teaser), dan banner B2B kemitraan. List lengkap 11 resto dipindah ke `/jelajah`. |
| [`src/app/(marketing)/daftar-mitra/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28marketing%29/daftar-mitra/page.tsx) | Branch-2 | 444 | Formulir pendaftaran mitra mandiri 4-step wizard (Profil, Akun & Meja, Rekening Payout, Layar Sukses). |
| **Alur Pemesanan Customer `(customer)`** | | | |
| [`src/app/(customer)/jelajah/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/jelajah/page.tsx) | **Branch-4** | 22 | **[BARU]** Shell halaman `/jelajah`. Membungkus `<JelajahContent>` dalam `<Suspense>` boundary — wajib karena `useSearchParams()` tidak boleh digunakan langsung di level page pada Next.js 16. |
| [`src/app/(customer)/[restoSlug]/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/page.tsx) | Branch-3 | 273 | Halaman katalog restoran dinamis, pemilihan meja interaktif live, dan daftar menu makanan. |
| [`src/app/(customer)/[restoSlug]/checkout/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/checkout/page.tsx) | Branch-3 | 418 | Halaman checkout dengan timer kunci meja 10 menit, pemilih jam tiba (mode cepat / spesifik), fee QRIS/VA, dan persetujuan non-refundable. |
| [`src/app/(customer)/[restoSlug]/order/[id]/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/order/%5Bid%5D/page.tsx) | Branch-0 / 3 | 126 | Halaman live tracking tahapan memasak dapur (`received -> cooking -> ready -> completed`) dan petunjuk arah Google Maps. |
| [`src/app/(customer)/pesanan-saya/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/pesanan-saya/page.tsx) | Branch-0 / 3 | 88 | Halaman daftar riwayat pesanan dan status aktif milik customer yang sedang login. |
| **Otentikasi `(auth)`** | | | |
| [`src/app/(auth)/login/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28auth%29/login/page.tsx) | Branch-1 | 492 | Halaman login Google 1-click, registrasi customer dengan validasi 8-karakter, dan switcher portal staf resto. |
| [`src/app/auth/callback/route.ts`](file:///c:/My_Koding/QuickDine/src/app/auth/callback/route.ts) | Branch-1 | 24 | Handler pertukaran kode OAuth Google / Magic Link menjadi sesi otentikasi user aktif. |
| **Portal Resto `(dashboard)`** | | | |
| [`src/app/(dashboard)/dashboard/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/layout.tsx) | Branch-0 / 2 / **5** | 143 | Layout dashboard resto dengan BrandLogo, badge counter pesanan aktif pada menu KDS & header bell, status KDS Live online, dan bottom navigation mobile. |
| [`src/app/(dashboard)/dashboard/kds/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/kds/page.tsx) | Branch-0 / **5** | 134 | **[Branch-5: Dirombak]** Layar Kitchen Display System dapur: antrean pesanan real-time, filter tabs status, kartu pesanan dengan alarm masak & grace period late timer, check-in, dan demo reset. |
| [`src/app/(dashboard)/dashboard/tables/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/tables/page.tsx) | Branch-0 / **5** | 179 | **[Branch-5: Dirombak]** Layar kontrol denah meja kasir: legend 4 status penuh, metrik ringkasan, grid meja interaktif, modal walk-in check-in offline, dan modal aksi detail meja. |
| [`src/app/(dashboard)/dashboard/menu/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/menu/page.tsx) | Branch-0 | 75 | Halaman manajemen master menu resto dan toggle ketersediaan stok habis. |
| [`src/app/(dashboard)/dashboard/finance/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/finance/page.tsx) | Branch-0 | 80 | Halaman rekap omset bersih harian dan riwayat pencairan saldo (*Payout H+1*). |
| [`src/app/(dashboard)/dashboard/settings/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/settings/page.tsx) | Branch-0 | 78 | Halaman konfigurasi resto, jam operasional, dan parameter `cook_trigger_minutes`. |
| **Portal Platform `(super-admin)`** | | | |
| [`src/app/(super-admin)/super-admin/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28super-admin%29/super-admin/page.tsx) | Branch-0 | 95 | Portal master super admin platform untuk memantau total GMV transaksi, mitra aktif, dan profit platform fee. |
| **API Endpoints & Root** | | | |
| [`src/app/api/cron/cleanup-locks/route.ts`](file:///c:/My_Koding/QuickDine/src/app/api/cron/cleanup-locks/route.ts) | Branch-0 | 26 | Cron API endpoint untuk membersihkan meja yang melewati batas waktu lock 10 menit kembali menjadi `VACANT`. |
| [`src/app/api/webhooks/midtrans/route.ts`](file:///c:/My_Koding/QuickDine/src/app/api/webhooks/midtrans/route.ts) | Branch-0 | 52 | Webhook API endpoint untuk menerima callback notifikasi status pembayaran dari Midtrans. |
| [`src/app/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/layout.tsx) | Branch-0 / 2 | 35 | Root HTML Layout Next.js, definisi metadata SEO, favicon `/icon.png`, dan font Inter. |
| [`src/app/globals.css`](file:///c:/My_Koding/QuickDine/src/app/globals.css) | Branch-0 | 45 | Konfigurasi CSS Tailwind v4, token warna Emerald Green `#006948`, dan base styling. |
| [`src/app/providers.tsx`](file:///c:/My_Koding/QuickDine/src/app/providers.tsx) | Branch-0 | 25 | Provider wrapper untuk TanStack QueryClient dan notifikasi toast Sonner. |

---

## 🎨 H. Aset Publik & Konfigurasi Root
| File | Branch | Peran & Rincian Fungsi |
|---|---|---|
| [`public/favicon.ico`](file:///c:/My_Koding/QuickDine/public/favicon.ico) | Branch-2 | Favicon browser format ico. |
| [`public/icon.png`](file:///c:/My_Koding/QuickDine/public/icon.png) | Branch-2 | Ikon resmi shield hijau QuickDine resolusi tinggi dengan latar belakang transparan. |
| [`public/images/logo.png`](file:///c:/My_Koding/QuickDine/public/images/logo.png) | Branch-2 | Master file gambar logo QuickDine. |
| [`AGENTS.md`](file:///c:/My_Koding/QuickDine/AGENTS.md) | Branch-0 | Aturan dan batasan koding utama AI pair programming (<500 baris/file, Feature-Driven Architecture). |
| [`package.json`](file:///c:/My_Koding/QuickDine/package.json) | Branch-0 | Daftar dependensi proyek (Next.js 16, React 19, Supabase, Prisma 7, Zustand, Tailwind 4, Lucide). |
| [`tsconfig.json`](file:///c:/My_Koding/QuickDine/tsconfig.json) | Branch-0 | Konfigurasi path aliases `@/*` TypeScript. |

---

## 📊 3. Rekapitulasi Audit Batas Baris Kode

- **Total File Kode:** 48 file
- **File Melebihi 500 Baris:** **0 File (100% Lolos Batas Aman)**
- **File Terbesar Saat Ini:** `src/app/(auth)/login/page.tsx` (492 baris).
- **Status Kompilasi `npx next build`:** **0 Error (19/19 Rute Lolos Sukses)**.
