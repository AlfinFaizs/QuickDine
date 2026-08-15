# Branch 5 — `feat/dashboard-kds-and-tables`

## Ringkasan Branch

Branch ini berfokus pada pembangunan **Portal Operasional Restoran (Back-Office & Front-of-House)** yang terdiri dari dua modul inti:
1. **Kitchen Display System (KDS) Real-Time (`/dashboard/kds`)** — Antrean pesanan dapur live, alarm waktu mulai masak, dan penanganan keterlambatan tamu (Grace Period).
2. **Kontrol Denah Meja Kasir Live (`/dashboard/tables`)** — Visualisasi denah meja interaktif dengan 4 status penuh (*VACANT*, *LOCKED*, *RESERVED*, *OCCUPIED*), check-in tamu walk-in offline, dan modal inspeksi detail pesanan meja.

---

## Apa yang Dikerjakan

### 1. Kitchen Display System (KDS) Realtime (`/dashboard/kds`)
- **Alarm Waktu Masak Otomatis (Cook Trigger Alarm):** Sistem menghitung mundur jam kedatangan pelanggan ($T_{\text{arr}}$). Saat waktu tersisa $\le 15$ menit, kartu pesanan otomatis memunculkan banner oranye/amber menyala: *"Waktunya Masak! (Tiba dlm X mnt)"*.
- **Grace Period & Keterlambatan Tamu:**
  - 🟡 **Keterlambatan 1–15 Menit:** Kartu pesanan memunculkan timer kuning *"Tamu Terlambat (+X menit)"*.
  - 🔴 **Lewat Toleransi (>15 Menit):** Kartu pesanan berkedip merah *"LEWAT BATAS TOLERANSI"* dengan 2 tombol aksi:
    - **`[Bungkus (Takeaway) & Kosongkan Meja]`** — Mengubah status pesanan menjadi `converted_takeaway` dan membebaskan meja menjadi `VACANT`.
    - **`[+ Beri Toleransi Tambahan (10 Menit)]`** — Memberikan kelonggaran waktu jika resto sedang sepi.
- **Dukungan Kustomisasi Menu & Catatan Koki:** Menampilkan opsi varian (suhu, level pedas, jenis susu/gula) dan catatan khusus dapur dalam kotak sorotan khusus.
- **Tombol Aksi Dapur:**
  - `[Mulai Masak]` $\rightarrow$ status beralih ke `cooking`
  - `[Selesai Masak & Siap Saji]` $\rightarrow$ status beralih ke `ready`
  - `[Tamu Tiba]` $\rightarrow$ konfirmasi tamu duduk, menghentikan timer keterlambatan
  - `[Selesai Santap]` $\rightarrow$ status beralih ke `completed`
- **Filter Tab Antrean:** *Semua Pesanan*, *Perlu Dimasak*, *Sedang Dimasak*, *Siap Saji*, *Peringatan Terlambat*, dan *Riwayat Selesai*.
- **Metrik Realtime & Toggle Audio:** Menghitung total antrean, buzzer alarm suara dapur on/off, dan pencarian instan meja/pesanan/nama pelanggan.

---

### 2. Manajemen Denah Meja Kasir Live (`/dashboard/tables`)
- **4 Status Penuh Meja (Live Status Badges):**
  - 🟢 **`VACANT` (Kosong):** Meja bersih dan siap menerima tamu baru atau pesanan online.
  - 🟡 **`LOCKED` (Sedang Checkout):** Meja sedang dikunci oleh pelanggan online dengan timer hitung mundur live 10 menit (`10:00` $\rightarrow$ `00:00`). Meja otomatis un-lock jika waktu habis.
  - 🔵 **`RESERVED` (Sudah Bayar):** Tamu telah melunasi pre-order online, menampilkan nama tamu, jam estimasi tiba, dan status masakan di dapur.
  - 🔴 **`OCCUPIED` (Sedang Makan):** Tamu sudah duduk di meja, menampilkan durasi duduk dan daftar pesanan aktif.
- **Walk-In Check-In Modal (`TableWalkinModal`):** Kasir dapat memasukkan tamu walk-in offline langsung ke meja kosong (Nama, Jumlah Pax 1–8, dan Catatan Tambahan).
- **Inspeksi Detail Meja Modal (`TableDetailModal`):** Kasir dapat melihat rincian lengkap menu makanan, kontak WhatsApp pelanggan, total pembayaran, dan override status meja manual (*Set Vacant*, *Set Occupied*, *Set Maintenance*).
- **Filter Area & Metrik Occupancy:** Tab pembagian area (*Semua Area*, *Indoor Utama*, *Outdoor Garden*, *VIP Room*), status filter, dan ringkasan persentase keterisian meja (*Occupancy Rate %*).

---

## File yang Tersentuh / Dibuat

### [NEW] `src/features/kds/kds-data.ts`
Model data TypeScript, tipe status kedatangan (`on_the_way`, `arrived`, `late_grace`, `tolerance_exceeded`), status dapur (`received`, `cooking`, `ready`, `completed`, `converted_takeaway`), serta mock dataset antrean dapur.

### [NEW] `src/features/kds/kds-order-card.tsx`
Komponen modular kartu pesanan dapur dengan styling status dinamis, banner alarm masak, timer keterlambatan, rincian varian menu, tautan WhatsApp tamu, dan tombol aksi tahapan memasak.

### [NEW] `src/features/kds/kds-header-stats.tsx`
Komponen header statistik live antrean dapur, 4 kartu metrik counter, toggle alarm suara buzzer, dan search input filter.

### [MODIFIED] `src/app/(dashboard)/dashboard/kds/page.tsx`
Halaman utama KDS (< 200 baris) mengintegrasikan seluruh komponen KDS, filter tabs, transisi status masak, check-in tamu, toleransi, dan no-show trigger.

### [NEW] `src/features/tables/tables-data.ts`
Model data denah meja, pembagian area (*Indoor Utama*, *Outdoor Garden*, *VIP Room*), kapasitas kursi, 4 status meja, dan model pesanan aktif meja.

### [NEW] `src/features/tables/table-card.tsx`
Komponen modular kartu meja kasir dengan live countdown lock 10 menit, badge status 4 warna, preview pesanan aktif, dan tombol cepat aksi (*Walk-In, Tamu Tiba, Kosongkan, Detail*).

### [NEW] `src/features/tables/table-walkin-modal.tsx`
Komponen modal form check-in tamu walk-in offline dengan pilihan pax cepat dan validasi kapasitas meja.

### [NEW] `src/features/tables/table-detail-modal.tsx`
Komponen modal pop-up inspeksi detail meja, breakdown menu makanan, kontak pelanggan, dan tombol override status manual.

### [MODIFIED] `src/app/(dashboard)/dashboard/tables/page.tsx`
Halaman kontrol denah meja kasir (< 200 baris) dengan top metric cards (*Kosong, Locked, Reserved, Occupied, Occupancy Rate %*), filter area, dan grid denah meja.

---

## Audit Batas Baris Kode (< 500 Baris)

| File | Baris | Status |
|---|---|---|
| `src/features/kds/kds-data.ts` | 165 | ✅ Lolos (< 500 baris) |
| `src/features/kds/kds-order-card.tsx` | 248 | ✅ Lolos (< 500 baris) |
| `src/features/kds/kds-header-stats.tsx` | 114 | ✅ Lolos (< 500 baris) |
| `src/app/(dashboard)/dashboard/kds/page.tsx` | 188 | ✅ Lolos (< 500 baris) |
| `src/features/tables/tables-data.ts` | 155 | ✅ Lolos (< 500 baris) |
| `src/features/tables/table-card.tsx` | 208 | ✅ Lolos (< 500 baris) |
| `src/features/tables/table-walkin-modal.tsx` | 115 | ✅ Lolos (< 500 baris) |
| `src/features/tables/table-detail-modal.tsx` | 148 | ✅ Lolos (< 500 baris) |
| `src/app/(dashboard)/dashboard/tables/page.tsx` | 196 | ✅ Lolos (< 500 baris) |

---

## Verifikasi Kompilasi

- `npx next build`: **0 Error (19/19 Rute Terkompilasi Bersih)**
- `/dashboard/kds` dan `/dashboard/tables` terdaftar sebagai Static (○) pre-rendered pages.
