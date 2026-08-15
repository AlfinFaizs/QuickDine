# Branch 4 — `feat/landing-and-explore-page`

## Ringkasan Branch

Branch ini mengerjakan **pemisahan dan perombakan halaman utama customer-facing** platform QuickDine. Sebelumnya, landing page (`/`) berfungsi ganda sebagai halaman marketing sekaligus direktori lengkap semua restoran. Kondisi ini tidak skalabel dan tidak ideal secara UX.

Branch ini memisahkan keduanya menjadi dua halaman dengan tujuan berbeda:

| Halaman | Route | Fokus |
|---|---|---|
| **Landing Page** | `/` | Marketing & konversi — meyakinkan pengunjung baru untuk menggunakan platform |
| **Halaman Jelajah** | `/jelajah` | Discovery & katalog — alat pencarian dan filter seluruh restoran mitra |

---

## Apa yang Dikerjakan

### 1. Perombakan Total Landing Page (`/`)

Halaman `/` diubah dari direktori restoran menjadi halaman marketing profesional dengan struktur baru:

- **Hero Section** — Tagline utama, search bar yang mengarahkan ke `/jelajah` (bukan filter lokal), dan 3 trust stats (120+ Mitra, 50rb+ Pre-Order, 0 Menit Tunggu)
- **Section "Cara Kerja"** *(baru)* — 3 langkah bergambar ikon: Pilih Restoran & Meja → Pre-Order & Bayar → Tiba, Duduk & Langsung Santap
- **Featured Restos Preview** *(baru, menggantikan grid penuh)* — Hanya menampilkan **4 restoran terpopuler** (filter berdasarkan rating tertinggi) sebagai teaser, dilengkapi tombol "Lihat Semua →" yang mengarahkan ke `/jelajah`
- **B2B Partner Banner** — Tetap ada, tidak berubah
- **Footer** — Tetap ada, link "Direktori Restoran" diperbarui ke `/jelajah`

### 2. Halaman Jelajahi Restoran Baru (`/jelajah`) *(BARU)*

Halaman katalog penuh yang menjadi destinasi semua pencarian restoran, dengan fitur:

- **Page Header** — Judul, subtitle, dan badge dinamis jumlah restoran tersedia
- **Search Bar** — Pencarian real-time berdasarkan nama resto, area, kategori, atau menu populer; mendukung URL query param `?q=` untuk redirect dari landing page
- **Sort Dropdown (4 opsi)** — Rating Tertinggi / Jarak Terdekat / Meja Terbanyak / Paling Cepat Saji
- **Category Filter Pills** — Horizontal scrollable pills: Semua, Meja Ready, Coffee & Cafe, dst.
- **Restaurant Grid (3 kolom desktop)** — Setiap kartu menampilkan foto, badge ketersediaan meja (live pulse), rating + jumlah review, kategori, nama, jarak & area, estimasi persiapan, item populer & harga
- **"Tampilkan Lebih Banyak"** — Pagination sederhana (mulai tampil 9, tambah 6 per klik)
- **Empty State** — Tampilan khusus jika tidak ada hasil pencarian, dengan tombol reset filter

### 3. Update Navbar

- Ditambahkan link **"Jelajahi Restoran"** di desktop navbar dengan ikon `UtensilsCrossed`
- Link aktif (di-highlight) ketika berada di halaman `/jelajah`
- Search bar di navbar kini functional: submit form akan meredirect ke `/jelajah?q=<query>`

### 4. Update Footer

- Link navigasi "Direktori Restoran" diperbarui menjadi "Jelajahi Restoran" dengan href `/jelajah`

---

## File yang Tersentuh

### [MODIFIED] `src/app/(marketing)/page.tsx`
Halaman landing page dirombak total. Sebelumnya 255 baris berisi hero + filter + 11 kartu resto + B2B. Sesudah: 239 baris berisi hero marketing, section Cara Kerja, 4 kartu featured restos, dan B2B banner. Tidak ada lagi list lengkap atau filter kategori di halaman ini.

### [NEW] `src/app/(customer)/jelajah/page.tsx`
Shell halaman `/jelajah` yang tipis (22 baris). Bertugas membungkus `<JelajahContent />` dengan `<Suspense>` boundary — wajib karena `useSearchParams()` tidak bisa digunakan langsung di server-rendered page.

### [NEW] `src/features/restaurants/jelajah-content.tsx`
Komponen utama konten halaman `/jelajah` (282 baris). Berisi seluruh logika pencarian, filter, sort, dan render grid restoran. Dipisah dari `page.tsx` untuk memenuhi requirement Suspense Next.js 16.

### [MODIFIED] `src/components/shared/navbar.tsx`
- Ditambahkan link "Jelajahi Restoran" dengan icon dan active state
- Search bar diubah dari elemen pasif menjadi `<form>` yang redirect ke `/jelajah`
- Ditambahkan `useRouter` dan `useState` untuk handle form submission

### [MODIFIED] `src/components/shared/footer.tsx`
Link navigasi internal diperbarui dari `href="/"` (Direktori Restoran) menjadi `href="/jelajah"` (Jelajahi Restoran).

---

## Audit Baris (Kepatuhan < 500 baris)

| File | Jumlah Baris |
|---|---|
| `(marketing)/page.tsx` | 239 |
| `(customer)/jelajah/page.tsx` | 22 |
| `features/restaurants/jelajah-content.tsx` | 282 |
| `components/shared/navbar.tsx` | ~103 |
| `components/shared/footer.tsx` | 55 |

Semua file di bawah batas 500 baris. ✅

---

## Verifikasi Build

Build `npx next build` berhasil dengan **0 error**, menghasilkan 19 routes:
- `/jelajah` terdaftar sebagai **Static (○)** — berhasil pre-rendered saat build
- Semua route lama tetap berfungsi normal

---

## Flow Customer Setelah Branch Ini

```
Landing Page (/)
    │
    ├─ [Klik "Jelajahi Restoran Sekarang"] ──────────┐
    ├─ [Ketik di search bar → Enter] ────────────────┤
    ├─ [Klik "Lihat Semua" di featured] ─────────────┤
    ├─ [Klik link Navbar "Jelajahi Restoran"] ────────┤
    └─ [Klik link Footer "Jelajahi Restoran"] ────────┘
                                                      │
                                               /jelajah
                                      (Search + Filter + Grid)
                                                      │
                                              /{restoSlug}
                                        (Catalog menu + meja)
                                                      │
                                         /{restoSlug}/checkout
```
