# Branch 8 — `feat/webhooks-payment-and-notifications`

## Ringkasan Branch

Branch ini mengimplementasikan **Sistem Notifikasi Telegram Bot Multi-Tenant, Webhook Payment Gateway Midtrans Terpadu, dan Simulator Pembayaran Sandbox Live**:
1. **Telegram Notification Service Adapter (`src/services/notification/telegram.service.ts`)** — Pengiriman pesan rincian pesanan terformat HTML ke Grup Telegram dapur restoran yang bersangkutan secara instan (<1 detik), 100% gratis, bebas risiko banned dari Meta, dan dilengkapi graceful fallback simulator.
2. **Konfigurasi Telegram & Uji Notifikasi Resto (`/dashboard/settings`)** — Panduan 3-langkah setup bot platform `@QuickDineAlertBot`, input Chat ID Grup Dapur, dan tombol **`[Kirim Pesan Uji Coba (Test Alert)]`**.
3. **Midtrans Webhook & Sandbox Payment Simulator (`/api/webhooks/midtrans` & `payment-simulator-modal.tsx`)** — Modal simulasi pembayaran QRIS dan Virtual Account di halaman checkout untuk menguji alur lunas tanpa memerlukan akun payment gateway aktif dari klien.
4. **Otomatisasi Status Meja & Dapur** — Pembayaran lunas seketika mengubah status meja menjadi `OCCUPIED`, pesanan diteruskan ke KDS dapur, dan saldo tercatat di buku kas.

---

## Rincian Fitur yang Diimplementasikan

### 1. Adapter Notifikasi Telegram Multi-Tenant (`telegram.service.ts`)
- **Format Pesan Terstruktur:**
  - Header: Nomor pesanan (`#QD-XXXXXX`) dan nama restoran.
  - Informasi Meja & Tamu: Nomor meja yang dipesan, nama pemesan, nomor HP, dan estimasi jam tiba.
  - Daftar Item Menu & Catatan Khusus Koki.
  - Total Pembayaran & Status Lunas.
- **Isolasi Tenant:** Notifikasi hanya terkirim ke `chat_id` grup Telegram milik restoran yang menerima pesanan. Restoran lain tidak menerima pesan tersebut.
- **Graceful Mock Fallback:** Jika `TELEGRAM_BOT_TOKEN` belum dipasang di `.env`, sistem otomatis mencatat pesan ke log konsol lokal tanpa menyebabkan aplikasi crash.

### 2. Panel Pengaturan Telegram di Dashboard Restoran (`/dashboard/settings`)
- Form input ID Grup Telegram kru dapur restoran.
- Panduan 3 langkah mudah menghubungkan bot resmi `@QuickDineAlertBot`.
- Tombol **`[Kirim Tes Notifikasi]`** dengan toast notifikasi sukses/info.

### 3. Simulator Pembayaran Midtrans Live (`payment-simulator-modal.tsx`)
- Tampil otomatis saat customer menekan tombol *"Bayar & Kunci Meja Sekarang"* di halaman checkout.
- Menampilkan QR Code QRIS interaktif dan Nomor Virtual Account (BCA / Mandiri) dengan tombol salin nomor VA.
- **Tombol Aksi Simulasi:**
  - **`[Simulasikan Pembayaran Berhasil (Lunas)]`**: Memanggil webhook Midtrans dengan status `settlement`, mengosongkan keranjang, dan mengarahkan ke halaman tracking live order `/[restoSlug]/order/[id]`.
  - **`[Simulasi Batal / Expired]`**: Memanggil webhook dengan status `expire` untuk melepaskan kunci meja kembali menjadi `VACANT`.

### 4. Handler Webhook Midtrans (`/api/webhooks/midtrans`)
- Memvalidasi signature transaksi (jika di environment production).
- Mengupdate status pesanan (`paid` dan `received`).
- Mengubah status meja dari `locked` menjadi `reserved` / `occupied`.
- Menambah kredit saldo ke tabel `balance_ledgers`.
- Memicu pengiriman pesan Telegram ke grup staf dapur restoran.

---

## File Baru & File yang Dimodifikasi

| File | Branch | Baris | Peran & Rincian Fungsi |
|---|---|---|---|
| [`src/services/notification/telegram.service.ts`](file:///c:/My_Koding/QuickDine/src/services/notification/telegram.service.ts) | **Branch-8** | 152 | Service adapter pengiriman notifikasi terformat HTML ke Telegram Bot API dengan mode simulasi aman. |
| [`src/services/notification/index.ts`](file:///c:/My_Koding/QuickDine/src/services/notification/index.ts) | **Branch-8** | 30 | Factory provider untuk Telegram dan WhatsApp notification service. |
| [`src/features/partner/notification-actions.ts`](file:///c:/My_Koding/QuickDine/src/features/partner/notification-actions.ts) | **Branch-8** | 28 | Server action untuk menguji pengiriman pesan tes notifikasi Telegram dari dashboard resto. |
| [`src/features/orders/payment-simulator-modal.tsx`](file:///c:/My_Koding/QuickDine/src/features/orders/payment-simulator-modal.tsx) | **Branch-8** | 180 | Modal simulator sandbox Midtrans untuk QRIS & Virtual Account dengan tombol webhook trigger. |
| [`src/app/api/webhooks/midtrans/route.ts`](file:///c:/My_Koding/QuickDine/src/app/api/webhooks/midtrans/route.ts) | **Branch-8** | 138 | Handler webhook Midtrans terintegrasi pemicu notifikasi Telegram dan transisi status meja. |
| [`src/app/(dashboard)/dashboard/settings/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28dashboard%29/dashboard/settings/page.tsx) | **Branch-8** | 340 | Pengaturan operasional resto terintegrasi konfigurasi Telegram Chat ID dan tombol tes notifikasi. |
| [`src/app/(customer)/[restoSlug]/checkout/page.tsx`](file:///c:/My_Koding/QuickDine/src/app/%28customer%29/%5BrestoSlug%5D/checkout/page.tsx) | **Branch-8** | 482 | Halaman checkout terintegrasi modal simulator pembayaran sandbox Midtrans. |

---

## Audit Kepatuhan Batas Baris (< 500 Baris)

- **Total File Kode Proyek:** 69 file
- **File Melebihi 500 Baris:** **0 File (100% Lolos Batas Aman)**
- **Verifikasi Build `npx next build`:** **0 Error (20/20 Rute Lolos Sukses)**
- **Status Git:** Branch `feat/webhooks-payment-and-notifications` bersih (*Committed*).
