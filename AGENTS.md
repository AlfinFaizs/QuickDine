<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# QuickDine — Panduan & Aturan Koding AI Pair Programming

## 1. Aturan Git Commit (Wajib Deskripsi Rinci & Bahasa Indonesia)

1. **Jangan Melakukan Commit Terlalu Sering / Perubahan Kecil:**
   - Dilarang membuat commit untuk setiap perubahan kecil atau per satu baris kode.
   - Commit hanya dilakukan ketika sebuah unit fitur, modul, atau perbaikan telah **selesai secara utuh, stabil, dan terverifikasi lolos uji (`npx next build`)**.

2. **Wajib Memiliki Judul DAN Deskripsi Commit Rinci dalam Bahasa Indonesia:**
   - Dilarang membuat commit satu baris polos tanpa penjelasan.
   - Setiap commit **WAJIB** menyertakan judul ringkas terstruktur (`feat`, `fix`, `refactor`, `docs`, `chore`) dan **Deskripsi Rinci (Body Message)** berisi poin-poin perubahan, alasan teknis, serta status verifikasi.
   - **Format Standar Perintah Commit:**
     ```bash
     git commit -m "tipe(cakupan): judul ringkas fitur/perubahan" -m "- Poin perubahan 1: rincian implementasi dan file utama yang disesuaikan
     - Poin perubahan 2: alasan arsitektur atau peningkatan UX yang dilakukan
     - Poin perubahan 3: penyesuaian dependensi atau server action
     - Status verifikasi: kompilasi lolos 0 error (X/X rute sukses)"
     ```

---

## 2. Aturan Penulisan & Pemeliharaan Dokumentasi Proyek

Setiap penyelesaian branch fitur atau penambahan modul baru, agen wajib membuat dan memperbarui dokumentasi di folder `Dokumentasi/`:

1. **Dokumentasi per Branch (`Dokumentasi/Branch-X-<nama-branch>.md`):**
   - Wajib dibuat untuk setiap branch fitur baru.
   - Memuat: Ringkasan branch, rincian teknis fitur yang dibangun, tabel file baru & modifikasi (beserta jumlah baris dan perannya), serta audit batas baris file.

2. **Dokumentasi Master yang Wajib Selalu Diperbarui:**
   - [`Dokumentasi/Peta-Struktur.md`](file:///c:/My_Koding/QuickDine/Dokumentasi/Peta-Struktur.md): Visualisasi pohon struktur folder dan file proyek terkini dengan komentar peran fungsional tiap file.
   - [`Dokumentasi/Kamus-File.md`](file:///c:/My_Koding/QuickDine/Dokumentasi/Kamus-File.md): Tabel katalog seluruh file proyek yang memuat: nama file (clickable link), branch asal, jumlah baris, dan peran teknis detail, serta rekapitulasi audit batas baris.

3. **Gaya Penulisan Dokumentasi:**
   - Gunakan **Bahasa Indonesia formal, terstruktur, profesional, dan jelas**.
   - Gunakan tabel markdown untuk komparasi dan daftar file.
   - Sertakan tautan file yang dapat diklik (*clickable markdown links*) dengan skema `file:///`.

---

## 3. Batas Ketat Panjang File Kode (< 500 Baris)

- **Setiap file kode (`.ts`, `.tsx`, `.js`, `.css`) STRICTLY dilarang melebihi 500 baris.**
- Jika sebuah komponen atau modul mulai mendekati 400–450 baris, wajib dipecah (*refactor*) menjadi sub-komponen atau sub-modul terpisah di folder `src/features/<domain>/`.

---

## 4. Standar UI/UX & Desain (Emerald Efficiency)

1. **Identitas Visual:**
   - Warna utama platform: **Emerald Green (`#006948`)**, aksen Amber (`#fea619`), latar belakang bersih (`#faf8ff`).
   - Tipografi modern menggunakan Font **Inter**.
   - Sudut melengkung halus (`rounded-2xl` / `rounded-xl`).
2. **Responsivitas Konsisten:**
   - Desktop: Navigasi Sidebar vertikal di sebelah kiri.
   - Mobile / Android: Navigasi *Bottom Bar* yang ramah ibu jari (*thumb-friendly*).
3. **Bahasa Antarmuka (*Anti-Jargon*):**
   - Gunakan Bahasa Indonesia bisnis yang ramah pengguna awam.
   - Dilarang menampilkan istilah teknis developer mentah di UI pengguna (seperti `(Radio)`, `(Checkbox)`, `T-Cook`, `Fonnte API`).
4. **Kebersihan Ikon:**
   - Hindari penggunaan emoji dekoratif berlebihan atau ikon `Sparkles` sembarangan agar tampilan tetap terlihat elegan, berwibawa, dan profesional bagi restoran korporat/mitra.
