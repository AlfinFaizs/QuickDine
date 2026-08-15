# 🍽️ QuickDine — SaaS Reservasi Meja & Pre-Order F&B

> **Platform SaaS Multi-Tenant** berbasis web untuk reservasi meja *real-time*, *pre-order* menu, dan pembayaran digital tanpa antre di lokasi.

---

## 🌟 Key Features

- **Live Interactive Table Map**: Pantau ketersediaan meja secara *live* dengan mekanisme *atomic locking* 10 menit saat checkout.
- **Pre-Order & Menu Catalog**: Pilih varian makanan, tingkat kepedasan, dan catatan khusus per menu.
- **Seamless Digital Payments**: Dukungan QRIS dan Virtual Account (BCA, Mandiri, BRI, BNI) via Midtrans Snap.
- **Kitchen Display System (KDS)**: Dashboard dapur & kasir *real-time* untuk memantau pesanan masuk, progres masak, dan manajemen walk-in.
- **WhatsApp Notification Service**: Pengiriman struk digital customer, notifikasi order ke grup kasir, dan laporan harian owner.
- **Financial Ledger & Manual Payouts**: Rekap omset bersih harian dan ekspor CSV untuk pencairan saldo resto.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, TypeScript, React 19) |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, Sonner Toast |
| **Database & Auth** | PostgreSQL via Supabase, Supabase Auth (JWT + Custom Claims), Supabase Realtime |
| **ORM** | Prisma ORM |
| **State Management** | TanStack Query, Zustand |
| **Validation** | React Hook Form, Zod |
| **Payment Gateway** | Midtrans Snap API |
| **Messaging** | Fonnte WhatsApp Gateway (Adapter Pattern) |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/AlfinFaizs/QuickDine.git
cd QuickDine
npm install
```

### 2. Environment Variables

Salin `.env.example` ke `.env.local` dan isi kredensial yang sesuai:

```bash
cp .env.example .env.local
```

### 3. Setup Supabase Database

Buka Supabase SQL Editor pada project Anda, lalu salin dan jalankan seluruh query dari:
`supabase/schema.sql`

Query tersebut akan membuat tabel, indeks performa, aturan keamanan RLS (Row Level Security), dan fungsi atomik PostgreSQL (RPC).

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📁 Project Structure

```text
quickdine/
├── prisma/               # Prisma schema & database configs
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router (Pages, Layouts, Providers)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Supabase clients, utils & adapters
│   └── middleware.ts     # Route protection & session management
├── supabase/             # SQL scripts, DDL, RLS policies, & RPC functions
└── PRD/                  # Product Requirement Documents
```

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
