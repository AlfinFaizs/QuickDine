# 📘 Dokumentasi Branch-2: Pendaftaran Mitra Restoran (`feat/partner-registration`)

**Tanggal:** 16 Agustus 2026  
**Status:** Selesai & Ter-commit di Lokal  
**Branch:** `feat/partner-registration`  
**Disusun Mengikuti PRD:** `PRD/PRD_QuickDine_PesanMeja_v3_Final.md` (Bagian 9 & 10)  

---

## 1. Ikhtisar & Tujuan Fitur

Branch `feat/partner-registration` berfokus pada implementasi alur **Pendaftaran Mitra Restoran Mandiri (*Self-Serve Partner Onboarding*)** di rute **`/daftar-mitra`**, integrasi server action multi-tenant setup, pembuatan default denah meja, integrasi logo brand resmi, dan penambahan banner B2B kemitraan di landing page publik.

---

## 2. Rincian File yang Dibuat & Dimodifikasi

### A. File Baru ([NEW])
1. [`src/app/(marketing)/daftar-mitra/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28marketing%29/daftar-mitra/page.tsx) (444 baris)
   - **Peran:** Halaman formulir pendaftaran mitra resto multi-step (Profil Resto, Akun & Meja, Rekening Payout, dan Layar Sukses).
2. [`src/features/partner/actions.ts`](file:///c:/My_Koding/QuickDine/src/features/partner/actions.ts) (112 baris)
   - **Peran:** Server Action untuk pendaftaran akun Owner di Supabase Auth, insert data tenant ke tabel `restaurants`, set JWT custom claims (`role: 'owner'`), dan seed denah meja awal.
3. [`src/components/shared/brand-logo.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/brand-logo.tsx) (61 baris)
   - **Peran:** Komponen logo brand terpadu menggunakan ikon shield hijau transparan.
4. [`src/features/restaurants/mock-data.ts`](file:///c:/My_Koding/QuickDine/src/features/restaurants/mock-data.ts) (221 baris)
   - **Peran:** Data modular 11 restoran & kafe populer Indonesia beserta kategori kuliner dan status meja live.
5. [`public/icon.png`](file:///c:/My_Koding/QuickDine/public/icon.png) & [`src/app/icon.png`](file:///c:/My_Koding/QuickDine/src/app/icon.png)
   - **Peran:** Aset favicon tab browser dan logo aplikasi beresolusi tinggi dengan latar belakang transparan.

### B. File yang Dimodifikasi ([MODIFIED])
1. [`src/app/(marketing)/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28marketing%29/page.tsx) (254 baris)
   - **Perubahan:** Penambahan B2B Partner Onboarding Banner section sebelum footer, integrasi BrandLogo, dan import modular mock-data.
2. [`src/components/shared/navbar.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/navbar.tsx) (88 baris)
   - **Perubahan:** Mengarahkan tombol `Daftarkan Resto` ke `/daftar-mitra` dan memasang komponen `BrandLogo`.
3. [`src/components/shared/footer.tsx`](file:///c:/My_Koding/QuickDine/src/components/shared/footer.tsx) (54 baris)
   - **Perubahan:** Pemasangan komponen `BrandLogo` dan perbaikan teks menjadi *"Platform Reservasi Meja & Pre-Order Kuliner"*.
4. [`src/app/(dashboard)/dashboard/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/layout.tsx) (115 baris)
   - **Perubahan:** Pemasangan `BrandLogo` pada sidebar desktop dan header mobile dashboard.
5. [`src/app/layout.tsx`](file:///c:/My_Koding/QuickDine/src/app/layout.tsx) (35 baris)
   - **Perubahan:** Penambahan deklarasi metadata icons untuk tab favicon browser.

---

## 3. Formulir Multi-Step Onboarding (`/daftar-mitra`)

Formulir dirancang dalam 4 tahapan interaktif dengan *stepper indicator* modern:
- **Langkah 1: Profil & Identitas Restoran:** Nama resto & cabang, kategori kuliner, kota/area, dan alamat lengkap.
- **Langkah 2: Akun Pemilik & Operasional Meja:** Nama PIC resto, nomor WhatsApp aktif, email & password akun owner, jumlah meja awal (default 10 meja), dan estimasi waktu masak (15 mnt).
- **Langkah 3: Rekening Pencairan Saldo (Payout H+1):** Nama bank, nomor rekening, nama pemilik rekening, serta aktivasi otomatis *Free Trial 14 Hari*.
- **Langkah 4: Layar Sukses & Aktivasi:** Sambutan selamat datang & tombol direct ke `/dashboard/kds`.

---

## 4. Hasil Pengujian, Kompilasi & Audit Batas Baris

```bash
npm run build
```
- **Kompilasi TypeScript:** 0 Error (Lolos 100%).
- **Status Rute:** `/daftar-mitra`, `/login`, dan seluruh rute aplikasi ter-generate sempurna.
- **Audit Panjang File:** Semua file terverifikasi berada di bawah batas **500 baris** (Sesuai `AGENTS.md`).

---

## 5. Riwayat Git Commit Lokal
```text
* fd46e41 (HEAD -> feat/partner-registration) feat: populate 11 realistic Indonesian restaurants across diverse culinary categories
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
