# Branch 5 — `feat/dashboard-kds-and-tables`

## Ringkasan Branch

Branch ini mengimplementasikan **Portal Operasional Restoran** yang berfokus pada dua modul krusial di sisi dapur dan kasir:
1. **Kitchen Display System (KDS)** di `/dashboard/kds` — antrean pesanan real-time untuk tim dapur.
2. **Denah Meja Live & Kontrol Kasir** di `/dashboard/tables` — visual denah meja dengan 4 status penuh dan kontrol walk-in manual.

---

## Apa yang Dikerjakan

### 1. Kitchen Display System (KDS) (`/dashboard/kds`)
- **Header Stats Realtime**: Menampilkan metrik ringkas: *Menunggu Masak*, *Sedang Dimasak*, *Siap Disajikan*, dan *Total Pesanan Aktif*.
- **Filter Tabs**: Tab filter dinamis (*Semua*, *Menunggu Masak*, *Sedang Dimasak*, *Siap Saji*) dengan indikator jumlah pesanan per status.
- **Kartu Pesanan Interaktif (`kds-order-card.tsx`)**:
  - Badge status memasak (`received`, `cooking`, `ready`) dan nomor meja besar.
  - Nama customer, no HP, dan rincian menu + catatan khusus koki (notes highlighting).
  - **Hitung Mundur Estimasi Kedatangan Tamu**: Menghitung selisih waktu tiba secara real-time.
  - **Grace Period (Toleransi Keterlambatan Tamu 15 Menit)**:
    - 🟡 *Tamu Terlambat (+X menit)*: Banner kuning otomatis jika melewati jam tiba.
    - 🔴 *Lewat Batas Toleransi (+X menit)*: Banner merah berkedip jika melewati 15 menit keterlambatan.
  - **Tombol Aksi Dapur**:
    - `[Mulai Masak Sekarang]` (status: `received` → `cooking`)
    - `[Tandai Siap Saji]` (status: `cooking` → `ready`)
    - `[Tamu Tiba ✓]` (Check-in customer saat tiba di meja)
    - `[Bungkus & Lepas Meja]` (No-Show trigger: bungkus makanan dan bebaskan meja)
    - `[Beri Toleransi Lagi]` (Memberikan toleransi waktu ekstra bagi tamu)
- **Tombol Reset Demo**: Mengembalikan pesanan demo ke kondisi awal untuk simulasi.

### 2. Denah Meja Live — Kasir (`/dashboard/tables`)
- **Indikator 4 Status Penuh**:
  - 🟢 **VACANT (Kosong)**: Meja siap pakai.
  - 🟡 **LOCKED (Sedang Checkout)**: Meja dikunci 10 menit oleh sistem customer.
  - 🔵 **RESERVED (Sudah Bayar)**: Tamu sudah pre-order & bayar, menunggu jam kedatangan.
  - ⚪ **OCCUPIED (Sedang Makan)**: Tamu aktif berada di meja.
- **Legend & Ringkasan Metrik**: Bar kartu jumlah meja per masing-masing status.
- **Kartu Meja Interaktif (`table-card.tsx`)**:
  - Visual status color-coded, nomor meja, kapasitas kursi.
  - Informasi tamu pemesan, estimasi jam tiba, nomor HP, dan ID pesanan jika ada.
- **Modal Input Walk-In Kasir (`table-walkin-modal.tsx`)**:
  - Jika kasir mengklik meja kosong (VACANT), muncul formulir instan untuk menginput nama tamu & no HP walk-in offline. Status meja otomatis berubah ke OCCUPIED.
- **Modal Aksi Detail Meja (`table-detail-modal.tsx`)**:
  - Muncul saat kasir mengklik meja berstatus `reserved`, `occupied`, atau `locked`.
  - Aksi: `[Tamu Tiba — Check-In Sekarang]`, `[Trigger No-Show — Bungkus & Lepas Meja]`, dan `[Kosongkan Meja (Tamu Selesai)]`.

### 3. Dashboard Layout Enhancement (`layout.tsx`)
- Menambahkan **Badge Counter Pesanan Aktif** pada sidebar menu KDS dan top header bar.
- Menambahkan **Mobile Bottom Navigation Bar** untuk kemudahan navigasi staf saat menggunakan perangkat tablet/smartphone kasir.
- Status badge `KDS Live Online` dengan pulsing indicator.

---

## File Baru & File yang Tersentuh

### [NEW] `src/features/kds/kds-data.ts`
Definisi tipe data TypeScript (`KdsOrder`, `KdsOrderItem`, `KdsOrderStatus`) dan data mock pesanan KDS dengan perhitungan waktu dinamis.

### [NEW] `src/features/kds/kds-order-card.tsx`
Komponen kartu pesanan dapur modular. Dilengkapi hook penghitung menit sejak order, countdown kedatangan, banner late/grace-period, dan rangkaian tombol aksi.

### [NEW] `src/features/kds/kds-header-stats.tsx`
Komponen bar 4 statistik status pesanan KDS dengan color coding dan ikon terpadu.

### [MODIFIED] `src/app/(dashboard)/dashboard/kds/page.tsx`
Halaman utama KDS yang mengintegrasikan stats, filter tabs, order grid, serta state handlers untuk status progression, check-in, dan no-show.

### [NEW] `src/features/tables/tables-data.ts`
Definisi tipe data `DashboardTable`, `TableStatus`, mock tables data, dan konfigurasi styling per status (`STATUS_CONFIG`).

### [NEW] `src/features/tables/table-card.tsx`
Komponen kartu meja individual untuk denah kasir dengan indikator status visual dan ringkasan info tamu.

### [NEW] `src/features/tables/table-walkin-modal.tsx`
Modal pop-up form input tamu walk-in offline untuk meja kosong.

### [NEW] `src/features/tables/table-detail-modal.tsx`
Modal pop-up aksi detail meja untuk check-in reservasi, no-show release, dan clear table.

### [MODIFIED] `src/app/(dashboard)/dashboard/tables/page.tsx`
Halaman utama manajemen denah meja kasir yang mengintegrasikan filter, visual grid meja, modal walk-in, dan modal aksi detail.

### [MODIFIED] `src/app/(dashboard)/dashboard/layout.tsx`
Layout dashboard resto dengan counter pesanan aktif pada sidebar, status live online, dan mobile bottom navigation bar.

---

## Audit Baris (Kepatuhan < 500 baris)

| File | Jumlah Baris |
|---|---|
| `features/kds/kds-data.ts` | 89 |
| `features/kds/kds-order-card.tsx` | 246 |
| `features/kds/kds-header-stats.tsx` | 74 |
| `(dashboard)/dashboard/kds/page.tsx` | 134 |
| `features/tables/tables-data.ts` | 63 |
| `features/tables/table-card.tsx` | 83 |
| `features/tables/table-walkin-modal.tsx` | 89 |
| `features/tables/table-detail-modal.tsx` | 114 |
| `(dashboard)/dashboard/tables/page.tsx` | 192 |
| `(dashboard)/dashboard/layout.tsx` | 143 |

Seluruh file berada jauh di bawah batas 500 baris. ✅

---

## Verifikasi Build

Build `npx next build` berjalan dengan **0 error**, seluruh 19 routes lolos pre-rendering / dynamic serving dengan sempurna.
