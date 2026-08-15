# 📘 Dokumentasi Branch-3: Alur Pemesanan & Checkout Customer (`feat/customer-ordering`)

**Tanggal:** 16 Agustus 2026  
**Status:** Selesai & Ter-commit di Lokal  
**Branch:** `feat/customer-ordering`  
**Disusun Mengikuti PRD:** `PRD/PRD_QuickDine_PesanMeja_v3_Final.md` (Bagian 4, 5, 6, 7, & 18.2)  

---

## 1. Ikhtisar & Tujuan Fitur

Branch `feat/customer-ordering` berfokus pada penyempurnaan menyeluruh pengalaman pelanggan (*Customer Ordering & Reservation Journey*) mulai dari pemilihan meja interaktif di katalog resto hingga proses pembayaran dengan timer penguncian meja:
- **Penyembunyian Menu "Pesanan Saya" untuk Tamu:** Navigasi *Pesanan Saya* di Navbar hanya tampil jika pelanggan sudah terautentikasi (login).
- **Katalog Resto Dinamis (`/[restoSlug]`):** Mendukung 11 restoran dengan foto banner, info waktu masak, deskripsi, dan menu unik per resto.
- **Denah Meja Interaktif (*Interactive Table Map*):** Visualisasi tata letak meja dengan indikator status live `vacant` (hijau), `locked` (kuning hitung mundur), dan `occupied` (abu-abu/merah).
- **Modal Varian & Catatan Koki:** Pop-up kustomisasi pilihan suhu (*Hot/Iced*), level gula, level pedas, extra topping, dan catatan dapur.
- **State Management Keranjang (Zustand):** State persisten (`cart-store.ts`) yang menyimpan pesanan dan nomor meja antar halaman.
- **Form Checkout & Pembayaran (`/[restoSlug]/checkout`):** Timer kunci meja 10 menit, data pemesan WhatsApp, pilihan jam kedatangan cepat vs spesifik, metode bayar QRIS/VA, dan klausul persetujuan *non-refundable*.

---

## 2. Rincian File yang Dibuat & Dimodifikasi

### A. File Baru ([NEW])
1. [`src/features/orders/cart-store.ts`](file:///c:/My_Koding/QuickDine/src/features/orders/cart-store.ts) (121 baris)
   - **Peran:** Zustand persistent store untuk menyimpan data restoran, item menu, varian pilihan, catatan koki, dan meja terpilih.
2. [`src/features/restaurants/restaurant-details-data.ts`](file:///c:/My_Koding/QuickDine/src/features/restaurants/restaurant-details-data.ts) (401 baris)
   - **Peran:** Database penyedia data lengkap 11 restoran (menu makanan, harga, opsi varian, denah meja, jam operasional).
3. [`src/features/restaurants/table-map.tsx`](file:///c:/My_Koding/QuickDine/src/features/restaurants/table-map.tsx) (135 baris)
   - **Peran:** Komponen visual denah meja dengan selektor interaktif dan badge status meja live.
4. [`src/features/restaurants/menu-variant-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/restaurants/menu-variant-modal.tsx) (217 baris)
   - **Peran:** Pop-up kustomisasi varian menu, quantity counter, kalkulasi harga real-time, dan textarea catatan koki.
5. [`src/features/orders/floating-cart-bar.tsx`](file:///c:/My_Koding/QuickDine/src/features/orders/floating-cart-bar.tsx) (86 baris)
   - **Peran:** Sticky bar di bagian bawah layar yang menampilkan total belanjaan, validasi meja, dan tombol lanjut checkout.

### B. File yang Dimodifikasi ([MODIFIED])
1. [`src/components/shared/navbar.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/navbar.tsx) (88 baris)
   - **Perubahan:** Membungkus tautan *Pesanan Saya* dengan kondisi `userEmail` sehingga hanya tampil saat user sudah login.
2. [`src/app/(customer)/[restoSlug]/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/page.tsx) (273 baris)
   - **Perubahan:** Mengganti mock statis lama dengan integrasi dinamis `getRestaurantDetail()`, komponen `TableMap`, `MenuVariantModal`, dan `FloatingCartBar`.
3. [`src/app/(customer)/[restoSlug]/checkout/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/checkout/page.tsx) (418 baris)
   - **Perubahan:** Menyempurnakan form checkout dengan timer 10 menit, pemilih jam tiba (mode cepat 15/30/45/60 mnt & jam kustom spesifik), rincian platform fee QRIS/VA, dan persetujuan non-refundable.

---

## 3. Alur UX Pemesanan Pelanggan (Step-by-Step)

```text
1. Beranda (Pilih salah satu dari 11 Restoran)
   ↓
2. Halaman Restoran (/[restoSlug])
   • Step 1: Pilih Nomor Meja di Denah Meja (misal: Meja 02 — 4 Kursi)
   • Step 2: Pilih Makanan -> Pop-up Varian (Hot/Iced, Level Pedas, Catatan Khusus)
   • Step 3: Floating Cart Bar muncul di bawah (Total Menu + Subtotal)
   ↓
3. Klik "Lanjut ke Pembayaran"
   ↓
4. Halaman Checkout (/[restoSlug]/checkout)
   • Timer Kunci Meja 10 Menit berjalan live (10:00 -> 00:00)
   • Isi Nama Lengkap & Nomor WhatsApp Aktif
   • Pilih Jam Tiba (Mode Cepat atau Jam Spesifik)
   • Pilih Metode Bayar (QRIS Instant atau Virtual Account)
   • Centang Persetujuan Non-refundable & Grace Period 15 Menit
   ↓
5. Klik "Bayar & Kunci Meja Sekarang" -> Mengalihkan ke Live Tracking (/[restoSlug]/order/[id])
```

---

## 4. Hasil Pengujian, Kompilasi & Audit Batas Baris

```bash
npm run build
```
- **Kompilasi TypeScript:** 0 Error (Lolos 100%).
- **Status Rute:** Seluruh 17 rute Next.js ter-generate sempurna.
- **Audit Panjang File:** Semua file terverifikasi berada di bawah batas **500 baris** (Sesuai `AGENTS.md`).

---

## 5. Riwayat Git Commit Lokal
```text
* 44730fe (HEAD -> feat/customer-ordering) feat: enhance checkout arrival time with quick pills and custom specific time picker
* 54620ff feat: implement dynamic customer catalog, interactive table map, variant modal, and 10-min lock checkout
* fd46e41 (feat/partner-registration) feat: populate 11 realistic Indonesian restaurants across diverse culinary categories
* a83cc50 fix: make logo background transparent, remove border artifact, and update browser tab favicon
* d48cc51 feat: integrate official QuickDine shield logo and relocate to public/images
* d10a72c chore: refine UI copy to use professional platform terminology instead of technical SaaS terms
* b4bd0ad feat: implement self-serve partner onboarding wizard and B2B landing banner
* 45dc86b (feat/login-page) refactor: extract password checklist and google icon to maintain <500 lines rule
* 1887907 feat: fix divider alignment and add 2-step password validation with 8-char security rules
* b8ca9d6 feat: implement Google 1-click OAuth, customer register toggle, and discrete staff portal switch
* c86de08 chore: exclude internal documentation, PRD, and AI agent files from git
* 4f77c36 docs: add comprehensive branch-0 and branch-1 architecture documentation
* 4b7e01d chore: replace default Next.js favicon and assets with QuickDine brand icon
* 9365bdf feat: polish login and register page with segmented tabs and magic link flow
```
