# Branch 6 — `feat/dashboard-menu-and-finance`

## Ringkasan Branch

Branch ini mengimplementasikan **Portal Manajemen Katalog Menu, Galeri Multi-Foto, Keuangan / Pembukuan Kas Digital, dan Pengaturan Operasional Restoran**:
1. **Manajemen Master Menu (`/dashboard/menu`)** — CRUD katalog menu, filter kategori, live search, variant & modifier options manager, instant **Out-of-Stock Toggle Switch** (stok tersedia vs habis), serta galeri multi-foto (1–5 foto per hidangan) dengan auto-crop 800×800 px.
2. **Laporan Keuangan & Rekap Omset (`/dashboard/finance`)** — 4 kartu KPI finansial, buku kas digital (*transactions ledger*), dan **Export Microsoft Excel Resmi (.xlsx)** dengan styling korporat bertema Emerald Green `#006948`.
3. **Pengaturan Restoran & Operasional (`/dashboard/settings`)** — Konfigurasi profil, jam operasional, jadwal alarm masak dapur, rekening pencairan omset H+1, dan WhatsApp notification gateway.

---

## Rincian Fitur yang Diimplementasikan

### 1. Generator Berkas Microsoft Excel (.xlsx) Resmi (`src/lib/excel-export.ts`)
- Menggantikan CSV standar dengan berkas **Microsoft Excel asli (.xlsx)** menggunakan library `exceljs`.
- **Fitur Styling Spreadsheet:**
  - Blok judul laporan resmi & metadata waktu ekspor.
  - Ringkasan KPI finansial (*Total Omset Kotor*, *Total Potongan Fee*, *Saldo Bersih Siap Cair*).
  - Header tabel berwarna hijau zamrud (`#006948`), teks putih tebal, rata tengah, dan border tebal.
  - Format angka mata uang otomatis Rupiah (`Rp #,##0`) pada kolom omset kotor, potongan fee, dan omset bersih.
  - Baris total keseluruhan (*Summary Total Row*) dengan garis bawah ganda (*double bottom border*).
  - Penyesuaian lebar kolom otomatis (*auto-fit column width*).

### 2. Auto-Crop & Auto-Compress Foto Makanan di Browser (`src/lib/image-compressor.ts`)
- Mengubah foto kamera berukuran besar (misal 1920×1080 atau 4000×3000) menjadi foto standar **800 × 800 px (Rasio Persegi 1:1)**.
- **Center-Crop Otomatis:** Menggunakan HTML5 Canvas API untuk memotong bagian tengah foto secara simetris tanpa membuat makanan terlihat gepeng atau penyok.
- **Kompresi Ringan:** Mengompres ukuran file dari 3–5 MB menjadi sangat ringan (**hanya ~70–90 KB**), menghemat kuota dan mempercepat loading aplikasi customer.

### 3. Dukungan Galeri Multi-Foto (1–5 Foto per Menu)
- **Modal Upload Menu (`menu-form-modal.tsx`)**:
  - Tombol unggah langsung dari galeri/file komputer/kamera (`<input type="file" multiple />`).
  - Strip thumbnail foto dengan badge foto sampul (*Cover*).
  - Aksi `[Jadikan Sampul]` untuk mengubah foto utama dan tombol `[X]` untuk menghapus foto individual.
- **Slider pada Kartu Dashboard (`menu-card.tsx`)**:
  - Frame foto berasio persegi utuh 1:1 (`aspect-square`).
  - Panah navigasi kiri/kanan saat kursor diarahkan ke foto (*hover*) untuk melihat seluruh foto tanpa harus membuka modal.
  - Indikator titik (*dots*) dan badge counter foto (misal: `1/3 Foto`).
- **Slider pada Sisi Pelanggan (`[restoSlug]/page.tsx` & `menu-variant-modal.tsx`)**:
  - Kartu menu customer kini bisa diklik langsung untuk melihat galeri foto dan deskripsi lengkap.
  - Pop-up modal dilengkapi **touch swipe gesture** (geser layar di HP/tablet), tombol panah kiri-kanan, dan deretan thumbnail foto di bawah gambar utama.

### 4. Pembersihan Istilah Teknis (Sanitasi Jargon Developer)
- Seluruh istilah pemrograman telah diganti menjadi bahasa Indonesia bisnis yang natural:
  - `Pilih 1 (Radio)` ➔ **`Wajib Pilih 1 Pilihan`**
  - `Bisa Banyak (Checkbox)` ➔ **`Bisa Pilih Banyak Pilihan`**
  - `Parameter Waktu Masak Dapur (T-Cook)` ➔ **`Jadwal Mulai Memasak di Dapur`**
  - `Notifikasi WhatsApp Dapur (Fonnte API)` ➔ **`Notifikasi WhatsApp untuk Staf Dapur`**

### 5. Laporan Keuangan & Rekap Omset (`/dashboard/finance`)
- **4 Kartu KPI Ringkasan (`finance-kpi-cards.tsx`)**:
  - *Total Omset Kotor* (Gross Revenue).
  - *Total Potongan Fee* (Platform fee transparan QRIS Rp1.500 / VA Rp5.500).
  - *Saldo Bersih Siap Cair* (Net Balance hak mitra restoran).
  - *Status Payout H+1* (Jadwal transfer otomatis dan rekening tujuan).
- **Tabel Buku Kas Transaksi (`finance-ledger-table.tsx`)**:
  - Rincian per pesanan: No. Pesanan, Waktu, Nama & HP Customer, Badge Metode Pembayaran (QRIS / Mandiri VA / BCA VA / BNI VA), Gross, Fee, Net, dan Status Payout.
  - Filter metode pembayaran dan pencarian order.
  - Baris kalkulasi total ringkasan di bagian footer tabel.
- **Aksi Ekspor Excel**: Tombol `[Export Rekap Excel (.xlsx)]` dengan state loading dan auto-download.
- **Aksi Pencairan Cepat**: Modal konfirmasi pengajuan percepatan transfer saldo bersih ke bank mitra.

### 6. Pengaturan Restoran & Parameter Dapur (`/dashboard/settings`)
- **Profil & Jam Operasional**: Form nama restoran, alamat, no HP WhatsApp, jam buka, dan jam tutup.
- **Jadwal Mulai Masak Dapur**: Slider menit (5–45 menit) sebelum tamu tiba + toggle opsi *Auto-Cook*.
- **Rekening Payout H+1**: Input nama bank, nomor rekening, dan atas nama rekening pemilik resto.
- **Notifikasi WhatsApp**: Konfigurasi nomor WhatsApp staf dapur.

---

## File Baru & File yang Dimodifikasi

| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/lib/excel-export.ts`](file:///c:/My_Koding/QuickDine/src/lib/excel-export.ts) | **Branch-6** | 192 | Generator berkas spreadsheet Microsoft Excel (.xlsx) resmi dengan styling Emerald `#006948`. |
| [`src/lib/image-compressor.ts`](file:///c:/My_Koding/QuickDine/src/lib/image-compressor.ts) | **Branch-6** | 68 | Utilitas auto-crop tengah 800×800 px dan kompresi foto makanan ringan (<100KB) di browser. |
| [`src/features/menu/menu-data.ts`](file:///c:/My_Koding/QuickDine/src/features/menu/menu-data.ts) | **Branch-6** | 185 | Tipe data menu dengan array `imageUrls` multi-foto dan initial mock dataset. |
| [`src/features/menu/menu-card.tsx`](file:///c:/My_Koding/QuickDine/src/features/menu/menu-card.tsx) | **Branch-6** | 180 | Kartu menu berasio 1:1 persegi dengan slider multi-foto hover dan toggle stok instan. |
| [`src/features/menu/menu-form-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/menu/menu-form-modal.tsx) | **Branch-6** | 280 | Modal tambah/ubah menu dengan galeri upload 1–5 foto, cover selector, dan auto-crop. |
| [`src/features/menu/menu-variant-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/menu/menu-variant-modal.tsx) | **Branch-6** | 220 | Modal pengatur opsi varian menu bebas jargon teknis. |
| [`src/app/(dashboard)/dashboard/menu/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/menu/page.tsx) | **Branch-6** | 250 | Halaman manajemen master menu dengan filter kategori, pencarian, dan dialog konfirmasi hapus. |
| [`src/features/finance/finance-data.ts`](file:///c:/My_Koding/QuickDine/src/features/finance/finance-data.ts) | **Branch-6** | 125 | Tipe data transaksi keuangan, fee QRIS/VA, dan mock dataset pembukuan resto. |
| [`src/features/finance/finance-kpi-cards.tsx`](file:///c:/My_Koding/QuickDine/src/features/finance/finance-kpi-cards.tsx) | **Branch-6** | 90 | Bar 4 kartu metrik KPI keuangan restoran. |
| [`src/features/finance/finance-ledger-table.tsx`](file:///c:/My_Koding/QuickDine/src/features/finance/finance-ledger-table.tsx) | **Branch-6** | 170 | Tabel buku kas transaksi penjualan resto dengan filter dan total footer. |
| [`src/app/(dashboard)/dashboard/finance/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/finance/page.tsx) | **Branch-6** | 130 | Halaman rekapitulasi keuangan terintegrasi download Excel (.xlsx) dan pencairan saldo. |
| [`src/app/(dashboard)/dashboard/settings/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/settings/page.tsx) | **Branch-6** | 220 | Halaman pengaturan profil restoran, jadwal masak dapur, rekening bank, dan WhatsApp. |
| [`src/features/restaurants/menu-variant-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/restaurants/menu-variant-modal.tsx) | **Branch-6** | 285 | Pop-up kustomisasi customer dengan multi-photo carousel, touch swipe, dan thumbnail strip. |
| [`src/app/(customer)/[restoSlug]/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/page.tsx) | **Branch-6** | 290 | Halaman pemesanan customer dengan kartu menu clickable dan badge multi-foto. |

---

## Audit Kepatuhan Batas Baris (< 500 Baris)

- **Total File Kode Proyek:** 62 file
- **File Melebihi 500 Baris:** **0 File (100% Lolos Batas Aman)**
- **Verifikasi Build `npx next build`:** **0 Error (19/19 Rute Lolos Sukses)**
- **Status Git:** Branch `feat/dashboard-menu-and-finance` bersih (*Committed*).
