# Branch 5 — `feat/dashboard-kds-and-tables`

## Ringkasan Branch

Branch ini mengimplementasikan **Portal Operasional Restoran** yang berfokus pada dua modul krusial di sisi dapur dan kasir:
1. **Kitchen Display System (KDS)** di `/dashboard/kds` — antrean pesanan real-time untuk tim dapur.
2. **Denah Meja Live & Kontrol Kasir** di `/dashboard/tables` — visual denah meja dengan 4 status penuh dan kontrol walk-in manual.
3. **Penyempurnaan Keamanan, Konfirmasi Dialog, & Performa** — proteksi aksi destruktif 2-langkah, debounce, deduping notifikasi toast, migrasi Next.js 16 proxy convention, serta skeleton shimmer loading.

---

## Apa yang Dikerjakan

### 1. Kitchen Display System (KDS) (`/dashboard/kds`)
- **Header Stats Realtime (`kds-header-stats.tsx`)**: Menampilkan metrik ringkas: *Menunggu Masak*, *Sedang Dimasak*, *Siap Disajikan*, dan *Total Pesanan Aktif*.
- **Filter Tabs**: Tab filter dinamis (*Semua*, *Menunggu Masak*, *Sedang Dimasak*, *Siap Saji*) dengan indikator jumlah pesanan per status.
- **Kartu Pesanan Interaktif (`kds-order-card.tsx`)**:
  - Badge status memasak (`received`, `cooking`, `ready`) dan nomor meja besar.
  - Nama customer, no HP, dan rincian menu + catatan khusus koki (*notes highlighting*).
  - **Hitung Mundur Estimasi Kedatangan Tamu**: Menghitung selisih waktu tiba secara real-time.
  - **Grace Period (Toleransi Keterlambatan Tamu 15 Menit)**:
    - *Tamu Terlambat (+X menit)*: Banner kuning otomatis jika melewati jam tiba.
    - *Lewat Batas Toleransi (+X menit)*: Banner merah berkedip jika melewati 15 menit keterlambatan.
  - **Tombol Aksi Dapur**:
    - `[Mulai Masak Sekarang]` (status: `received` → `cooking`)
    - `[Tandai Siap Saji]` (status: `cooking` → `ready`)
    - `[Tamu Tiba]` (Check-in customer saat tiba di meja dengan konfirmasi)
    - `[Bungkus & Lepas Meja]` (No-Show trigger: dialog konfirmasi bahaya 2-langkah)
    - `[Selesai]` (Tandai pesanan selesai dengan dialog konfirmasi)
    - `[Beri Toleransi Lagi]` (Memberikan toleransi waktu ekstra bagi tamu)
- **Tombol Reset Demo**: Mengembalikan pesanan demo ke kondisi awal untuk simulasi.
- **Skeleton Shimmer Loading (`kds-skeleton.tsx`)**: Menampilkan shimmer loading state halus saat data sedang dimuat.

### 2. Denah Meja Live — Kasir (`/dashboard/tables`)
- **Indikator 4 Status Penuh**:
  - **VACANT (Kosong)**: Meja siap pakai.
  - **LOCKED (Sedang Checkout)**: Meja dikunci 10 menit oleh sistem customer.
  - **RESERVED (Sudah Bayar)**: Tamu sudah pre-order & bayar, menunggu jam kedatangan.
  - **OCCUPIED (Sedang Makan)**: Tamu aktif berada di meja.
- **Legend & Ringkasan Metrik**: Bar kartu jumlah meja per masing-masing status.
- **Kartu Meja Interaktif (`table-card.tsx`)**:
  - Visual status color-coded, nomor meja, kapasitas kursi.
  - Informasi tamu pemesan, estimasi jam tiba, nomor HP, dan ID pesanan jika ada.
- **Modal Input Walk-In Kasir (`table-walkin-modal.tsx`)**:
  - Jika kasir mengklik meja kosong (VACANT), muncul formulir instan untuk menginput nama tamu & no HP walk-in offline. Status meja otomatis berubah ke OCCUPIED.
- **Modal Aksi Detail Meja (`table-detail-modal.tsx`)**:
  - Muncul saat kasir mengklik meja berstatus `reserved`, `occupied`, atau `locked`.
  - Terintegrasi dialog konfirmasi 2-langkah untuk aksi krusial: `[Tamu Tiba — Check-In]`, `[Trigger No-Show — Bungkus & Lepas Meja]`, dan `[Kosongkan Meja (Tamu Selesai)]`.
- **Skeleton Shimmer Loading (`tables-skeleton.tsx`)**: Menampilkan shimmer card grid saat denah meja diinisialisasi.

### 3. Dashboard Layout Enhancement (`layout.tsx`)
- Menambahkan **Badge Counter Pesanan Aktif** pada sidebar menu KDS dan top header bar.
- Menambahkan **Mobile Bottom Navigation Bar** untuk kemudahan navigasi staf saat menggunakan perangkat tablet/smartphone kasir.
- Status badge `KDS Live Online` dengan pulsing indicator.

### 4. Dialog Konfirmasi, Debouncing, & Perbaikan Bug Notifikasi
- **Komponen Reusable `ConfirmDialog` (`src/components/ui/confirm-dialog.tsx`)**:
  - Melindungi aksi destruktif operasional kasir/koki dari salah sentuh layar (*accidental touchscreen taps*).
  - Dilengkapi tombol konfirmasi bahaya/peringatan, keyboard trap `ESC`, dan internal lock debounce 400ms.
- **Deduplikasi Notifikasi Toast & Idempotensi**:
  - Memperbaiki bug toast ganda dengan menambahkan parameter `id` eksplisit pada seluruh handler toast.
  - Konfigurasi `Toaster` di `providers.tsx` dengan `duration={2500}`, `expand={false}`, dan `visibleToasts={2}`.
  - Pengecekan idempotensi pada seleksi meja katalog (`[restoSlug]/page.tsx`).

### 5. Keamanan Enterprise & Migrasi Next.js 16 Proxy
- **Security Headers (`next.config.ts`)**: Mengaktifkan `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, HSTS, dan image optimizer AVIF/WebP.
- **Sanitasi Input (`src/lib/sanitize.ts`)**: Mencegah XSS pada catatan koki dan formulir data tamu.
- **Migrasi `proxy.ts` (`src/proxy.ts`)**: Mengganti `src/middleware.ts` ke konvensi resmi Next.js 16 sehingga peringatan deprecation hilang sepenuhnya.

---

## File Baru & File yang Tersentuh

### [NEW] `src/components/ui/confirm-dialog.tsx` (108 baris)
Dialog modal konfirmasi 2-langkah dengan debounce, trap ESC, dan varian bahaya/peringatan.

### [NEW] `src/components/ui/skeleton.tsx` (16 baris)
Komponen primitif skeleton shimmer pulse Tailwind untuk state loading elegan.

### [NEW] `src/features/kds/kds-data.ts` (89 baris)
Definisi tipe data TypeScript (`KdsOrder`, `KdsOrderItem`, `KdsOrderStatus`) dan data mock pesanan KDS.

### [NEW] `src/features/kds/kds-order-card.tsx` (280 baris)
Komponen kartu pesanan dapur interaktif dengan timer elapsed, hitung mundur tiba, banner late (+1m) & grace period (+15m), modal konfirmasi aksi, tombol masak, check-in, dan no-show.

### [NEW] `src/features/kds/kds-header-stats.tsx` (74 baris)
Komponen bar 4 statistik status pesanan KDS dengan color coding dan ikon terpadu.

### [NEW] `src/features/kds/kds-skeleton.tsx` (41 baris)
Skeleton shimmer loader antrean kartu pesanan dapur KDS.

### [MODIFIED] `src/app/(dashboard)/dashboard/kds/page.tsx` (137 baris)
Halaman utama KDS yang mengintegrasikan stats, filter tabs, order grid, serta state handlers untuk status progression, check-in, no-show, dan toast IDs.

### [NEW] `src/features/tables/tables-data.ts` (63 baris)
Definisi tipe data `DashboardTable`, `TableStatus`, mock tables data, dan konfigurasi styling per status (`STATUS_CONFIG`).

### [NEW] `src/features/tables/table-card.tsx` (83 baris)
Komponen kartu meja individual untuk denah kasir dengan indikator status visual dan ringkasan info tamu.

### [NEW] `src/features/tables/table-walkin-modal.tsx` (89 baris)
Modal pop-up form input tamu walk-in offline untuk meja kosong.

### [NEW] `src/features/tables/table-detail-modal.tsx` (165 baris)
Modal pop-up aksi detail meja kasir terintegrasi `ConfirmDialog` untuk check-in reservasi, no-show release, dan clear table.

### [NEW] `src/features/tables/tables-skeleton.tsx` (35 baris)
Skeleton shimmer loader denah kartu meja kasir.

### [MODIFIED] `src/app/(dashboard)/dashboard/tables/page.tsx` (198 baris)
Halaman utama manajemen denah meja kasir yang mengintegrasikan filter, visual grid meja, modal walk-in, modal aksi detail, dan toast IDs.

### [MODIFIED] `src/app/(dashboard)/dashboard/layout.tsx` (143 baris)
Layout dashboard resto dengan counter pesanan aktif pada sidebar, status live online, dan mobile bottom navigation bar.

### [NEW] `src/lib/sanitize.ts` (27 baris)
Utilitas pembersihan string HTML tags dan XSS injection pada input tamu dan catatan koki.

### [MODIFIED] `src/proxy.ts` (20 baris)
Migrasi Edge Network Proxy Handler sesuai standar Next.js 16.

### [MODIFIED] `next.config.ts` (54 baris)
Konfigurasi Security Headers HTTP dan optimasi gambar AVIF/WebP.

---

## Audit Baris (Kepatuhan < 500 baris)

| File | Jumlah Baris | Status |
|---|---|---|
| `components/ui/confirm-dialog.tsx` | 108 | Aman (<500) |
| `components/ui/skeleton.tsx` | 16 | Aman (<500) |
| `features/kds/kds-data.ts` | 89 | Aman (<500) |
| `features/kds/kds-order-card.tsx` | 280 | Aman (<500) |
| `features/kds/kds-header-stats.tsx` | 74 | Aman (<500) |
| `features/kds/kds-skeleton.tsx` | 41 | Aman (<500) |
| `(dashboard)/dashboard/kds/page.tsx` | 137 | Aman (<500) |
| `features/tables/tables-data.ts` | 63 | Aman (<500) |
| `features/tables/table-card.tsx` | 83 | Aman (<500) |
| `features/tables/table-walkin-modal.tsx` | 89 | Aman (<500) |
| `features/tables/table-detail-modal.tsx` | 165 | Aman (<500) |
| `features/tables/tables-skeleton.tsx` | 35 | Aman (<500) |
| `(dashboard)/dashboard/tables/page.tsx` | 198 | Aman (<500) |
| `(dashboard)/dashboard/layout.tsx` | 143 | Aman (<500) |
| `lib/sanitize.ts` | 27 | Aman (<500) |
| `src/proxy.ts` | 20 | Aman (<500) |
| `next.config.ts` | 54 | Aman (<500) |

Seluruh 53 file kode proyek berada jauh di bawah batas 500 baris (100% kepatuhan aturan `AGENTS.md`).

---

## Verifikasi Build

Build `npx next build` berjalan dengan **0 error**, seluruh 19 routes lolos pre-rendering / dynamic serving dengan sempurna tanpa ada peringatan *deprecated*.
