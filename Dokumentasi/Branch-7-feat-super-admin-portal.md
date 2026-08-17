# Branch 7 — `feat/super-admin-portal`

## Ringkasan Branch

Branch ini mengimplementasikan **Portal Super Admin Platform QuickDine (`/super-admin` & `/super-admin/tenants`)** sebagai pusat kendali (*command center*) bagi tim operasional dan manajemen platform:
1. **Executive Platform KPI Dashboard (`/super-admin`)** — Memantau performa bisnis nasional secara *real-time*: Total GMV Platform, Pendapatan Fee Platform (QRIS Rp1.500 & VA Rp5.500), Volume Pesanan Hari Ini, Tingkat Keberhasilan Pesanan, dan **Export Master Ledger Excel (.xlsx)**.
2. **Manajemen Mitra Restoran & Verifikasi Tenant (`/super-admin/tenants`)** — Antrean verifikasi (*approval queue*) calon mitra pendaftar baru dari `/daftar-mitra` dengan aksi 1-Klik *Setujui Mitra (Approve)* / *Tolak*, kontrol status kemitraan (Aktif vs Ditangguhkan/Suspended), dan **Export Master Direktori Mitra Excel (.xlsx)**.
3. **Sidebar Desktop & Bottom Navigation Mobile (`super-admin/layout.tsx`)** — Mengikuti pola UX dashboard kasir: Menu samping kiri di desktop, bilah navigasi bawah (*bottom bar*) responsif di layar HP/Android, serta pemisahan data bersih tanpa redundansi antar halaman.

---

## Rincian Fitur & Pembaruan UI/UX

### 1. Ergonomi Tata Letak (Sidebar Desktop + Bottom Bar Mobile)
- **Menu Samping Kiri (Desktop `w-64`):**
  - Header brand logo QuickDine + badge *Super Admin*.
  - Link navigasi: *Ringkasan KPI* (`/super-admin`) dan *Mitra Restoran* (`/super-admin/tenants` dengan badge *10 Baru*).
  - Tombol keluar ke beranda publik di bagian bawah sidebar.
- **Top Header Bar:** Menampilkan breadcrumb status eksekutif dan indikator denyut hijau *Sistem Server Stabil*.
- **Bottom Navigation Bar (Mobile / Android):** Navigasi jempol mudah di bagian bawah layar saat dibuka di layar ponsel/tablet.
- **Ruang & Spacing Lega (*Whitespace*):** Kontainer kartu tidak padat, margin rapi, dan transisi hover yang nyaman di mata.

### 2. Eliminasi Redundansi Data & Skalabilitas Verifikasi (Anti-Clutter)
- **Halaman Ringkasan KPI (`/super-admin`):**
  - Dikhususkan 100% untuk metrik finansial & transaksi pesanan live (*Total GMV*, *Fee Revenue*, *Pesanan Hari Ini*, *Success Rate*, dan *Live Transaction Ledger*).
  - Tidak menduplikasi tabel atau antrean mitra restoran.
- **Halaman Mitra Restoran (`/super-admin/tenants`):**
  - **Antrean Verifikasi 10 Pendaftar Baru (`tenant-approval-queue.tsx`):**
    - Sistem **Pagination Karusel 3-Kartu per baris** (`Hal. 1 / 4`) sehingga tidak memenuhi atau memanjangkan layar ke bawah meskipun pendaftar bertambah banyak.
    - Tombol **`[Sembunyikan]`** / **`[Buka Antrean]`** untuk menciutkan antrean menjadi baris ringkas kapan saja.
    - Aksi 1-Klik **`[Setujui]`** & **`[Tolak]`** berpelindung `ConfirmDialog`.
  - **Direktori Seluruh Mitra (`tenant-directory-table.tsx`):**
    - Filter status (*Semua*, *Aktif*, *Ditangguhkan*), live search nama resto / pemilik / kota, serta toggle aksi **`[Bekukan]`** / **`[Aktifkan]`**.
    - Tombol **`[Export Data Mitra (.xlsx)]`** untuk rekapitulasi data rekening bank dan volume transaksi.

### 3. Generator Excel Super Admin (`src/lib/excel-export.ts`)
- Fungsi `exportSuperAdminTenantsToExcel()` & `exportFinanceToExcel()` menghasilkan berkas `.xlsx` dengan:
  - Judul Laporan Master Direktori Mitra / Master Ledger Platform.
  - Header tabel hijau zamrud (`#006948`) dengan teks putih tebal.
  - Format angka Rupiah (`Rp #,##0`) otomatis.
  - Kolom auto-fit width dan border tabel rapi.

---

## File Baru & File yang Dimodifikasi

| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/lib/excel-export.ts`](file:///c:/My_Koding/QuickDine/src/lib/excel-export.ts) | **Branch-7** | 290 | Generator berkas spreadsheet Microsoft Excel (.xlsx) resmi untuk rekapitulasi omset resto dan master direktori tenant Super Admin. |
| [`src/features/super-admin/super-admin-data.ts`](file:///c:/My_Koding/QuickDine/src/features/super-admin/super-admin-data.ts) | **Branch-7** | 250 | Definisi tipe data (`SuperAdminKPI`, `SuperAdminTenant`, `PendingPartnerApplication`) dan mock dataset nasional. |
| [`src/features/super-admin/super-admin-kpi-cards.tsx`](file:///c:/My_Koding/QuickDine/src/features/super-admin/super-admin-kpi-cards.tsx) | **Branch-7** | 97 | Bar 4 kartu KPI eksekutif finansial & volume pesanan harian. |
| [`src/features/super-admin/tenant-approval-queue.tsx`](file:///c:/My_Koding/QuickDine/src/features/super-admin/tenant-approval-queue.tsx) | **Branch-7** | 155 | Komponen antrean verifikasi mitra baru dengan aksi 1-Klik Setujui/Tolak dan `ConfirmDialog`. |
| [`src/features/super-admin/tenant-directory-table.tsx`](file:///c:/My_Koding/QuickDine/src/features/super-admin/tenant-directory-table.tsx) | **Branch-7** | 220 | Tabel master direktori mitra resto dengan filter status, search, dan toggle pembekuan mitra. |
| [`src/app/(super-admin)/super-admin/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28super-admin%29/super-admin/layout.tsx) | **Branch-7** | 145 | Layout Super Admin dengan Sidebar Kiri (Desktop) dan Bottom Navigation Bar (Mobile). |
| [`src/app/(super-admin)/super-admin/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28super-admin%29/super-admin/page.tsx) | **Branch-7** | 175 | Halaman dashboard eksekutif KPI platform dan log transaksi nasional live. |
| [`src/app/(super-admin)/super-admin/tenants/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28super-admin%29/super-admin/tenants/page.tsx) | **Branch-7** | 190 | Halaman manajemen mitra resto, antrean verifikasi pendaftar baru, dan ekspor data mitra Excel (.xlsx). |

---

## Audit Kepatuhan Batas Baris (< 500 Baris)

- **Total File Kode Proyek:** 67 file
- **File Melebihi 500 Baris:** **0 File (100% Lolos Batas Aman)**
- **Verifikasi Build `npx next build`:** **0 Error (20/20 Rute Lolos Sukses)**
- **Status Git:** Branch `feat/super-admin-portal` bersih (*Committed*).
