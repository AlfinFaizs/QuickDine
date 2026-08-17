# Product Requirement Document (PRD)
## QuickDine / PesanMeja — SaaS Reservasi Meja & Pre-Order F&B

**Versi:** 4.2 (Revisi — Klarifikasi Trigger LOCKED + Site Architecture 14 Halaman)
**Status:** Final — Beku untuk fase implementasi. Perubahan hanya via revisi bernomor versi.
**Target Tim:** Solo developer / tim kecil (<5 orang)

---

## 1. Product Overview & Problem Statement

**Masalah:**
- Pelanggan sering membatalkan niat makan di restoran karena tidak tahu status antrean meja dan lamanya waktu tunggu masak.
- Restoran kehilangan omset dari pelanggan yang *walk-out*, dan terbebani komisi tinggi (20–25%) dari aplikasi pesan-antar konvensional.

**Solusi:** Platform SaaS multi-tenant berbasis web (tanpa install aplikasi) yang memungkinkan pelanggan memeriksa ketersediaan meja secara *live*, memesan makanan di muka (*pre-order*), dan membayar sebelum tiba di lokasi.

**Value Proposition Restoran:** Turnover meja lebih terjaga, risiko *walk-out* diminimalkan, omset makanan diterima 100% utuh (tanpa potongan komisi), model biaya flat per bulan.

**Value Proposition Pelanggan:** Kepastian meja saat tiba, makanan mulai diproses mendekati jam kedatangan tanpa menunggu proses pesan konvensional.

---

## 2. User Roles & Personas

| Role | Target Pengguna | Akses & Tanggung Jawab Utama |
|---|---|---|
| **Customer (End-User)** | Pelanggan restoran | Reservasi meja, pilih menu, bayar via QRIS/VA, pantau status masakan |
| **Resto Staff (Kasir/Koki)** | Karyawan operasional | Terima pesanan (KDS), update status masakan, kelola status meja, trigger no-show |
| **Resto Owner** | Pemilik bisnis F&B | Kelola menu, konfigurasi meja, lihat laporan omset, terima rekap WA & ekspor payout |
| **Super Admin** | Klien SaaS (Platform Owner) | Kelola langganan resto, pantau log transaksi & disbursement, monitor platform fee |

---

## 3. Customer Journey & Ordering Flow

- **Resto Discovery & Direct Access:** direktori resto di halaman utama (`/`), akses langsung via slug (`/[resto-slug]`), atau scan QR meja di lokasi (`/[resto-slug]?table=X`).
- **Menu Catalog & Cart:** kategori makanan, varian/opsi (level pedas, less sugar, dll — didefinisikan di kolom `variants JSONB` pada tabel `menu_items` dan di-snapshot ke `selected_variants` di `order_items` saat checkout), catatan khusus per item. Browsing menu dan melihat status meja **tidak memerlukan login**.
- **Login sebelum Checkout (wajib):** saat customer menekan tombol "Lanjut Checkout", sistem memeriksa apakah sudah login. Jika belum, customer diarahkan ke halaman login/registrasi (Supabase Auth — email atau magic link). Setelah login berhasil, customer dikembalikan ke halaman checkout. **Alasan:** data order perlu dikaitkan ke akun customer agar halaman "Pesanan Saya" bisa menampilkan status tracking secara aman tanpa mengandalkan link satu kali pakai atau nomor WA.
- **Checkout:** field nama & no. WhatsApp diisi otomatis dari profil akun customer (bisa diedit). Input jam estimasi kedatangan. Kalkulasi biaya transparan di layar sebelum konfirmasi bayar (lihat Bagian 10).
- **Konfirmasi non-refundable:** checkbox/consent eksplisit di layar checkout ("Saya memahami pesanan ini tidak dapat dibatalkan/direfund") wajib dicentang sebelum tombol bayar aktif — ini syarat kepatuhan kebijakan di Bagian 5, bukan sekadar disclosure di dokumen internal.
- **Tracking Pesanan ("Pesanan Saya"):** halaman yang hanya bisa diakses oleh customer yang sudah login. Menampilkan daftar pesanan aktif dan riwayat, serta status masakan real-time (`received → cooking → ready → completed`).

---

## 4. Table State Machine & Order Lifecycle

```
[ VACANT ]
   │ (Customer mulai checkout)
   ▼
[ LOCKED ] ── (Batal / Expired 10 menit) ──> [ VACANT ]
   │ (Pembayaran berhasil / webhook lolos)
   ▼
[ RESERVED ] ── (No-Show > 15 menit) ──> [ VACANT ] (order → CONVERTED_TO_TAKEAWAY)
   │ (Customer tiba → staf klik "Check-In")
   ▼
[ OCCUPIED ]
   │ (Staf klik "Clear Table")
   ▼
[ VACANT ]
```

| State | Definisi | Tampil di Web Customer | Transisi Keluar |
|---|---|---|---|
| `VACANT` | Meja siap dipilih online maupun walk-in offline | ✅ Bisa dipilih | → `LOCKED` saat checkout dimulai |
| `LOCKED` | Terkunci 10 menit saat customer di layar bayar | ⏳ Tampil "Sedang Dipesan" + estimasi countdown | → `VACANT` (expired/batal) atau → `RESERVED` (bayar sukses) |
| `RESERVED` | Pembayaran terverifikasi; dapur mulai siapkan pesanan 15 menit sebelum `arrival_time` (configurable via `cook_trigger_minutes`); meja diberi penanda fisik | 🔒 Tampil "Sudah Dipesan" | → `OCCUPIED` (check-in) atau → `VACANT` (no-show) |
| `OCCUPIED` | Tamu sudah check-in dan sedang makan di lokasi secara fisik. **State ini tidak relevan untuk web ordering** — tamu yang sudah di meja tidak perlu dan tidak bisa pesan ulang via web. Pemesanan tambahan dilakukan langsung ke kasir/pelayan secara konvensional. | ❌ Tampil "Tidak Tersedia" | → `VACANT` (staf klik "Clear Table") |

**Catatan penting — OCCUPIED di web customer vs KDS kasir:**
- **Di halaman web customer (table map):** RESERVED dan OCCUPIED keduanya tampil sebagai "Tidak Tersedia" / warna abu-abu. Customer tidak perlu tahu perbedaannya — yang penting meja tidak bisa dipesan.
- **Di KDS kasir:** RESERVED dan OCCUPIED dibedakan dengan jelas, karena kasir perlu tahu mana yang menunggu kedatangan tamu (RESERVED) vs mana yang sudah aktif makan (OCCUPIED) untuk pengelolaan operasional.

**Keputusan implementasi (sudah final):**
- **Trigger mulai masak:** default 15 menit sebelum `arrival_time`. Nilai ini disimpan di kolom `cook_trigger_minutes INTEGER DEFAULT 15` pada tabel `restaurants` dan dapat dikonfigurasi per resto oleh Resto Owner.
- **Kapan LOCKED dipicu:** status meja berubah dari `VACANT → LOCKED` **tepat saat customer menekan tombol "Lanjut Checkout"** — bukan saat browse menu, bukan saat di halaman Midtrans. Selama customer masih memilih menu, meja tetap `VACANT` dan bisa diambil siapa saja. Ini berarti customer yang lebih cepat klik checkout akan mendapat meja meskipun customer lain sudah lebih dulu membuka halaman tersebut — perilaku ini **disengaja dan adil** (siapa cepat, dia dapat), dan mencegah meja terkunci lama oleh customer yang berlama-lama tanpa komitmen.
- **Transisi `VACANT → LOCKED` harus atomik.** Wajib lewat Postgres RPC function (`SECURITY DEFINER`) yang mengeksekusi `UPDATE ... WHERE status = 'vacant' RETURNING *` secara atomik — tidak boleh berupa `UPDATE` mentah dari client (anon key) karena rentan race condition dan griefing (mengunci meja berulang tanpa niat bayar).

**Order Status Lifecycle (terpisah dari Table State):**

| `order_status` | Kapan Di-set | Siapa yang Set |
|---|---|---|
| `pending` | Saat order pertama kali dibuat (sebelum bayar) | Client (via Server Action) |
| `received` | Setelah webhook payment sukses terverifikasi | Backend (service role) |
| `cooking` | Staf klik "Mulai Masak" di KDS | Kasir (via authenticated API) |
| `ready` | Staf klik "Siap Disajikan" di KDS | Kasir (via authenticated API) |
| `completed` | Staf klik "Selesai / Clear Table" | Kasir (via authenticated API) |
| `converted_takeaway` | Staf trigger No-Show setelah grace period | Kasir (via authenticated API) |

> **Penting:** `order_status` default di database adalah `'pending'`, **bukan `'received'`**. Status `received` hanya di-set oleh backend setelah webhook payment berhasil diverifikasi. Ini mencegah order yang belum dibayar masuk ke antrian KDS.

---

## 5. Kebijakan No-Show, Pembatalan & Refund (SOP Finansial)

- **Refund:** Non-refundable. Seluruh pesanan yang sudah terbayar bersifat final karena bahan makanan langsung diproses dapur.
- **Grace Period:** 15 menit dari `arrival_time`. Nilai ini di-compute server-side: `grace_period_until = arrival_time + INTERVAL '15 minutes'` — tidak boleh dikirim dari client.
- **Prosedur No-Show:** setelah 15 menit tanpa kehadiran/konfirmasi, tombol "Trigger No-Show" aktif di layar kasir. Kasir menekan tombol → meja `RESERVED → VACANT` (bisa dijual ke walk-in) → pesanan `order_status = CONVERTED_TO_TAKEAWAY`, makanan dikemas dan diserahkan bila customer datang terlambat.
- **Disclosure legal:** kebijakan non-refundable ini lazim dan legal di Indonesia selama didisclosure jelas di titik pembelian (lihat checkbox di Bagian 3) — bukan hanya tertulis di dokumen internal.

---

## 6. Kitchen Display System (KDS) & Resto Back-Office

**KDS / Kasir Dashboard:**
- Notifikasi visual + audio instan saat ada pesanan baru terbayar.
- Stage progression: `received → cooking → ready → completed` (plus `converted_takeaway` untuk kasus no-show).
- Manual table override untuk walk-in offline.

**Resto Management:**
- **Menu Builder:** CRUD kategori/menu, foto, harga, toggle stok habis, varian (disimpan di kolom `variants JSONB` pada `menu_items`).
- **Table Management:** CRUD nomor meja, kapasitas, cetak stiker QR otomatis.
- **Financial Ledger (Fase 1 MVP):** rekap harian/bulanan + **ekspor CSV untuk payout manual H+1** (disbursement otomatis didorong ke Fase 2 — lihat Bagian 16).

---

## 7. WhatsApp Notification Automation

Diisolasi dengan *adapter pattern* agar tidak terikat ke satu vendor:

```typescript
interface INotificationService {
  sendToCashierGroup(groupId: string, payload: OrderNotificationPayload): Promise<boolean>;
  sendCustomerReceipt(phone: string, payload: ReceiptPayload): Promise<boolean>;
  sendDailyOwnerReport(ownerPhone: string, summary: DailySummaryPayload): Promise<boolean>;
}
```

- **Fase MVP:** `FonnteNotificationService` (Paket Regular, Rp66.000/bulan) — kirim struk digital ke customer, notifikasi order ke grup kasir, laporan omset ke owner tiap pukul 23:00.
- **Fase Scale:** migrasi ke `MetaCloudApiNotificationService` (WhatsApp Cloud API resmi) atau `TelegramNotificationService` tanpa merombak logika modul pesanan — penting karena Fonnte adalah gateway tidak resmi yang rawan banned di volume tinggi.

---

## 8. Keamanan Write Path & Data Integrity

```
[ Frontend Client ] ── (hanya SELECT & INSERT draft order) ──┐
                                                              │
[ Payment Gateway Webhook ]                                  ▼
      │                                             ┌───────────────────┐
      ├── Verifikasi Signature Key                  │ Supabase Postgres │
      └── Backend Next.js (SERVICE_ROLE_KEY) ─────> │ payment_status:   │
                                                     │  PAID / EXPIRED   │
                                                     └───────────────────┘
```

- **Client SDK (anon key):** boleh `SELECT` menu & status meja, `INSERT` draft order (`payment_status = 'pending'`, `order_status = 'pending'`). **Dilarang mutlak:** `UPDATE` pada `orders`, `balance_ledgers`, atau kolom status transaksi apa pun.
- **Server-side (service role key):** hanya backend Next.js yang boleh mengubah `payment_status = 'paid'` dan `order_status = 'received'` serta transisi meja ke `RESERVED`, setelah verifikasi signature webhook Midtrans.
- **Dual-Layer Expiration:**
  1. *Event-driven:* webhook expire dari payment gateway → order `expired`, meja `vacant`.
  2. *Cron fallback:* job ringan tiap 2 menit membersihkan meja `locked` yang sudah lewat `locked_until`.
- **Idempotency Webhook:** kolom `payment_reference_id` di tabel `orders` memiliki `UNIQUE constraint`. Jika Midtrans mengirim webhook yang sama dua kali (retry otomatis), INSERT/UPDATE kedua akan gagal secara aman — tidak ada double-credit.

---

## 9. Auth & Multi-Tenant Isolation

**Provider:** Supabase Auth (JWT).

**Peran dan Scope Akses:**

| Role | Mekanisme Auth | JWT Custom Claims |
|---|---|---|
| **Customer (End-User)** | **Login wajib** untuk checkout & tracking pesanan (email atau magic link via Supabase Auth). Browsing menu & melihat status meja boleh tanpa login (anon). | `role: 'customer'` |
| **Resto Staff / Owner** | Login via email/password Supabase Auth | `restaurant_id`, `role: 'staff' \| 'owner'` |
| **Super Admin** | Login via email/password Supabase Auth | `role: 'super_admin'` |

**Alur login customer:**
1. Customer browse menu & table map → **tanpa login** (anon key).
2. Customer klik "Lanjut Checkout" → sistem cek session → **jika belum login, redirect ke `/login?next=/[slug]/checkout`**.
3. Login via email + magic link (Supabase Auth) — tidak perlu password, cukup klik link di email.
4. Setelah login → redirect kembali ke checkout, field nama & nomor WA diisi otomatis dari `user_metadata`.
5. Halaman `/pesanan-saya` hanya bisa diakses saat sudah login — menampilkan semua order milik customer tersebut berdasarkan `user_id`.

**JWT Custom Claims — Implementasi:**
- **Staff/Owner:** saat login, backend set custom claim via `supabase.auth.admin.updateUserById()` — claim wajib: `{ "restaurant_id": "<uuid>", "role": "staff" | "owner" }`.
- **Customer:** tidak perlu custom claim khusus — cukup `auth.uid()` (user ID dari Supabase Auth) yang secara otomatis tersedia setelah login. Kolom `customer_user_id UUID REFERENCES auth.users(id)` ditambahkan ke tabel `orders` untuk mengikat order ke akun customer.
- **Isolasi kritis:** RLS policy tabel resto tetap memfilter `restaurant_id`. Untuk customer, RLS policy orders memfilter `customer_user_id = auth.uid()`.
- Backend Next.js (service role) bypass RLS by design — otorisasi di application code wajib memvalidasi scope yang benar sebelum eksekusi query apa pun.

---

## 10. Business Model & Unit Economics

**Prinsip:** Restoran selalu menerima 100% subtotal makanan; beban gateway dialihkan ke biaya layanan customer.

| Metode Bayar | Estimasi Biaya Riil Gateway (MDR + PPN) | Fee ke Customer | Net Margin Platform |
|---|---|---|---|
| QRIS | 0,7% (~Rp350–700 per order Rp50k–100k) | Rp1.500 | +Rp800–1.150/order |
| Virtual Account | Rp4.000–4.500 + PPN 11% (±Rp4.995) | **Rp5.500** *(dinaikkan dari Rp5.000 untuk buffer margin)* | +Rp505–1.000/order |

**Langganan flat:** Rp200.000/bulan/resto.

**Biaya operasional yang mengurangi margin** (perlu diperhitungkan untuk break-even analysis): biaya hosting Railway/Render (~USD 5–10/bln), langganan Fonnte (Rp66.000/bln), biaya integrasi Midtrans — margin per-transaksi baru menutup biaya ini di volume tertentu.

---

## 11. Non-Functional Requirements & Edge Cases

- **Idempotency Webhook:** verifikasi Midtrans signature key + `UNIQUE constraint` pada `payment_reference_id` mencegah double-credit jika webhook dikirim ulang oleh gateway.
- **High Availability Realtime:** fallback long-polling tiap 10 detik jika koneksi WebSocket terputus.
- **Unique constraint** `(restaurant_id, table_number)` untuk cegah duplikasi nomor meja per resto.
- **FK `order_items.menu_item_id`:** `ON DELETE SET NULL` — karena `item_name` & `item_price` sudah di-snapshot ke `order_items`, data historis order tetap utuh meski menu dihapus. Alternatif: menu tidak pernah di-hard-delete, cukup `is_available = false`.
- **`grace_period_until` tidak boleh dikirim dari client.** Nilai ini dihitung server-side: `grace_period_until = arrival_time + INTERVAL '15 minutes'` — di Server Action atau RPC function sebelum INSERT ke database.
- **KDS adalah hard real-time system.** Deploy tidak boleh dilakukan dengan restart mentah saat jam operasional peak. Gunakan `pm2 reload app` (graceful reload) — bukan `pm2 restart` — untuk mencegah WebSocket KDS terputus di tengah operasional kasir.

---

## 12. Database Schema (DDL — Final)

```sql
-- 1. Tabel Restoran (Multi-Tenant Master)
CREATE TABLE restaurants (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 VARCHAR(255) NOT NULL,
    slug                 VARCHAR(100) UNIQUE NOT NULL,
    phone_whatsapp       VARCHAR(20) NOT NULL,
    owner_phone          VARCHAR(20) NOT NULL,
    wa_group_id          VARCHAR(100),
    bank_name            VARCHAR(50),
    bank_account_number  VARCHAR(50),
    bank_account_holder  VARCHAR(100),
    cook_trigger_minutes INTEGER DEFAULT 15,
    -- menit sebelum arrival_time untuk trigger mulai masak, configurable per resto
    subscription_status  VARCHAR(20) DEFAULT 'active',
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Langganan (History Subscription per Resto)
CREATE TABLE subscriptions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    plan              VARCHAR(50) DEFAULT 'flat_monthly',
    amount            NUMERIC(12, 2) NOT NULL DEFAULT 200000,
    status            VARCHAR(20) DEFAULT 'active',  -- active, expired, cancelled
    period_start      DATE NOT NULL,
    period_end        DATE NOT NULL,
    payment_reference VARCHAR(100),
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Meja
CREATE TABLE restaurant_tables (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number  VARCHAR(20) NOT NULL,
    capacity      INT DEFAULT 2,
    status        VARCHAR(20) DEFAULT 'vacant',
    -- vacant, locked, reserved, occupied
    locked_until  TIMESTAMP WITH TIME ZONE,
    qr_code_url   TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_resto_table UNIQUE(restaurant_id, table_number)
);

-- 4. Tabel Master Menu
CREATE TABLE menu_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    price         NUMERIC(12, 2) NOT NULL,
    image_url     TEXT,
    is_available  BOOLEAN DEFAULT TRUE,
    variants      JSONB DEFAULT '[]',
    -- contoh: [{"name":"Level Pedas","options":["Tidak Pedas","Sedang","Extra Pedas"]},
    --          {"name":"Gula","options":["Normal","Less Sugar"]}]
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Header Pesanan
CREATE TABLE orders (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id        UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id             UUID REFERENCES restaurant_tables(id),
    customer_user_id     UUID REFERENCES auth.users(id),
    -- user ID dari Supabase Auth — wajib diisi saat checkout (customer harus login)
    -- digunakan oleh RLS untuk SELECT "Pesanan Saya"
    customer_name        VARCHAR(100) NOT NULL,
    customer_phone       VARCHAR(20) NOT NULL,
    arrival_time         TIMESTAMP WITH TIME ZONE NOT NULL,
    grace_period_until   TIMESTAMP WITH TIME ZONE NOT NULL,
    -- WAJIB dihitung server-side: arrival_time + INTERVAL '15 minutes'
    -- TIDAK BOLEH diterima dari client input
    subtotal_amount      NUMERIC(12, 2) NOT NULL,
    platform_fee         NUMERIC(12, 2) NOT NULL,
    total_amount         NUMERIC(12, 2) NOT NULL,
    payment_method       VARCHAR(30),
    -- qris, bca_va, mandiri_va, bri_va, bni_va
    payment_status       VARCHAR(20) DEFAULT 'pending',
    -- pending, paid, expired, failed
    order_status         VARCHAR(30) DEFAULT 'pending',
    -- pending             → order dibuat, belum bayar (default INSERT dari client)
    -- received            → webhook payment sukses, set oleh backend (service role)
    -- cooking             → staf klik "Mulai Masak" di KDS
    -- ready               → staf klik "Siap Disajikan" di KDS
    -- completed           → staf klik "Selesai / Clear Table"
    -- converted_takeaway  → staf trigger No-Show setelah grace period
    payment_reference_id VARCHAR(100) UNIQUE,
    -- UNIQUE constraint untuk idempotency webhook Midtrans
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Detail Pesanan
CREATE TABLE order_items (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id      UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name         VARCHAR(255) NOT NULL,
    -- snapshot nama saat order, tahan perubahan menu di masa depan
    item_price        NUMERIC(12, 2) NOT NULL,
    -- snapshot harga saat order
    quantity          INT NOT NULL CHECK (quantity > 0),
    selected_variants JSONB DEFAULT '[]',
    -- contoh: [{"name":"Level Pedas","selected":"Extra Pedas"},
    --          {"name":"Gula","selected":"Less Sugar"}]
    special_notes     TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Ledger Saldo
CREATE TABLE balance_ledgers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id      UUID REFERENCES orders(id),
    amount        NUMERIC(12, 2) NOT NULL,
    type          VARCHAR(20) NOT NULL,  -- credit, debit
    description   TEXT,
    status        VARCHAR(20) DEFAULT 'completed',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_resto ON subscriptions(restaurant_id, status, period_end);
CREATE INDEX idx_tables_resto        ON restaurant_tables(restaurant_id, status);
CREATE INDEX idx_orders_resto        ON orders(restaurant_id, payment_status, created_at);
CREATE INDEX idx_orders_status       ON orders(restaurant_id, order_status);
CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_ledger_resto        ON balance_ledgers(restaurant_id, created_at);
CREATE INDEX idx_menu_resto          ON menu_items(restaurant_id, is_available);
```

---

## 13. Row Level Security (RLS) — Policy Skeleton

> RLS diaktifkan pada semua tabel. Client browser memakai `anon key` dan tunduk penuh pada policy ini. Backend Next.js memakai `service_role_key` yang bypass RLS — otorisasi di application code tetap wajib.

```sql
-- ============================================================
-- Aktifkan RLS pada semua tabel
-- ============================================================
ALTER TABLE restaurants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_ledgers   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper functions — ambil claim dari JWT
-- ============================================================
CREATE OR REPLACE FUNCTION auth_restaurant_id() RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'restaurant_id')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth_role() RETURNS TEXT AS $$
  SELECT auth.jwt() -> 'app_metadata' ->> 'role';
$$ LANGUAGE sql STABLE;

-- ============================================================
-- 1. restaurants
-- ============================================================
-- Staff/Owner: hanya lihat data restonya sendiri
CREATE POLICY "resto_select_own" ON restaurants
  FOR SELECT TO authenticated
  USING (id = auth_restaurant_id());

-- Owner: bisa update profil restonya sendiri
CREATE POLICY "resto_update_own" ON restaurants
  FOR UPDATE TO authenticated
  USING (id = auth_restaurant_id() AND auth_role() = 'owner');

-- ============================================================
-- 2. restaurant_tables
-- ============================================================
-- Anon (customer): SELECT status meja untuk halaman reservasi
CREATE POLICY "tables_select_public" ON restaurant_tables
  FOR SELECT TO anon
  USING (true); -- difilter restaurant_id di query level

-- Staff/Owner: SELECT semua meja restonya
CREATE POLICY "tables_select_staff" ON restaurant_tables
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id());

-- Owner: kelola meja restonya sendiri
CREATE POLICY "tables_manage_owner" ON restaurant_tables
  FOR ALL TO authenticated
  USING (restaurant_id = auth_restaurant_id() AND auth_role() = 'owner');

-- ============================================================
-- 3. menu_items
-- ============================================================
-- Anon: SELECT menu yang tersedia
CREATE POLICY "menu_select_public" ON menu_items
  FOR SELECT TO anon
  USING (is_available = true);

-- Staff/Owner: SELECT semua menu termasuk yang tidak tersedia
CREATE POLICY "menu_select_staff" ON menu_items
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id());

-- Owner: CRUD menu restonya sendiri
CREATE POLICY "menu_manage_owner" ON menu_items
  FOR ALL TO authenticated
  USING (restaurant_id = auth_restaurant_id() AND auth_role() = 'owner');

-- ============================================================
-- 4. orders
-- ============================================================
-- Customer (authenticated): INSERT order saat checkout
-- customer_user_id WAJIB diisi dengan auth.uid() — di-enforce di application layer
CREATE POLICY "orders_insert_customer" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (
    payment_status = 'pending'
    AND order_status = 'pending'
    AND customer_user_id = auth.uid()
  );

-- Customer (authenticated): SELECT pesanan milik sendiri untuk halaman "Pesanan Saya"
CREATE POLICY "orders_select_customer_own" ON orders
  FOR SELECT TO authenticated
  USING (customer_user_id = auth.uid());

-- Staff/Owner: SELECT semua order restonya
CREATE POLICY "orders_select_staff" ON orders
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id());

-- Staff: UPDATE order_status (payment_status TIDAK boleh diubah via policy ini)
-- Proteksi kolom sensitif (payment_status, payment_reference_id) dilakukan
-- di application layer — Server Action hanya allow-list kolom yang boleh diupdate
CREATE POLICY "orders_update_status_staff" ON orders
  FOR UPDATE TO authenticated
  USING (restaurant_id = auth_restaurant_id())
  WITH CHECK (restaurant_id = auth_restaurant_id());

-- ============================================================
-- 5. order_items
-- ============================================================
-- Customer (authenticated): INSERT saat membuat order
CREATE POLICY "order_items_insert_customer" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Staff/Owner: SELECT order_items dari order restonya
CREATE POLICY "order_items_select_staff" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.restaurant_id = auth_restaurant_id()
    )
  );

-- ============================================================
-- 6. balance_ledgers — TIDAK ADA AKSES MUTASI DARI CLIENT
-- ============================================================
-- Owner: SELECT untuk laporan keuangan saja
CREATE POLICY "ledger_select_owner" ON balance_ledgers
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id() AND auth_role() = 'owner');

-- ============================================================
-- 7. subscriptions
-- ============================================================
CREATE POLICY "subscriptions_select_owner" ON subscriptions
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id());
```

---

## 14. RPC Functions — Skeleton Kritis

### 14.1 Atomic Table Lock (Wajib ada sebelum modul reservasi jalan)

```sql
CREATE OR REPLACE FUNCTION lock_table_for_checkout(
  p_table_id      UUID,
  p_restaurant_id UUID,
  p_lock_duration INTERVAL DEFAULT '10 minutes'
)
RETURNS restaurant_tables
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result restaurant_tables;
BEGIN
  UPDATE restaurant_tables
  SET
    status       = 'locked',
    locked_until = NOW() + p_lock_duration
  WHERE
    id            = p_table_id
    AND restaurant_id = p_restaurant_id
    AND status    = 'vacant'  -- kondisi atomik: hanya berhasil jika masih vacant
  RETURNING * INTO v_result;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'TABLE_NOT_AVAILABLE'
      USING HINT = 'Meja sudah diambil atau sedang terkunci oleh customer lain.';
  END IF;

  RETURN v_result;
END;
$$;
```

### 14.2 Cron Cleanup — Expired Locked Tables

```sql
-- Dipanggil oleh node-cron tiap 2 menit via service_role key
CREATE OR REPLACE FUNCTION cleanup_expired_locks()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE restaurant_tables
  SET status = 'vacant', locked_until = NULL
  WHERE status = 'locked'
    AND locked_until < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
```

---

## 15. Technical Architecture & Stack

### 15.1 Core Application Layer
| Komponen | Pilihan | Peran |
|---|---|---|
| Framework | **Next.js (App Router, TypeScript)** | Frontend, Server Actions, REST API webhook — 1 repo (*modular monolith*) |
| Styling/UI | **Tailwind CSS + Shadcn UI** | Tabel kasir, modal reservasi, dialog checkout, badge status meja |
| State & Data Fetching | **TanStack Query + Zustand** | Sinkronisasi keranjang, status meja, notifikasi KDS |
| Form & Validasi | **React Hook Form + Zod** | Validasi nomor WA, nama, jam kedatangan, varian pesanan |

### 15.2 Database, ORM & Real-time
| Komponen | Pilihan | Peran |
|---|---|---|
| Database | **PostgreSQL via Supabase** (`ap-southeast-1`) | Data multi-tenant, index pada `restaurant_id` |
| ORM | **Prisma ORM** | Skema type-safe, migration, relasi tabel. Dipilih atas Drizzle karena ekosistem lebih matang & Prisma Studio memudahkan debugging solo dev |
| Realtime | **Supabase Realtime (WebSockets)** | Update warna status meja live, notifikasi KDS |
| Auth | **Supabase Auth (JWT + custom claims)** | Sesi login kasir, admin resto, super admin — `restaurant_id` & `role` disimpan di `app_metadata` |

**Catatan integrasi Prisma + RLS:** backend Next.js memakai *service role key* (bypass RLS, otorisasi divalidasi di application code), client browser memakai `supabase-js` (anon key, tunduk RLS). Pola *hybrid* ini valid. Yang wajib dijaga: `schema.prisma` dan RLS policy harus disinkronkan setiap ada perubahan skema.

### 15.3 Infrastructure & Deployment
| Komponen | Pilihan | Alasan |
|---|---|---|
| App Server | **Railway atau Render (Managed PaaS)** | Zero-ops untuk solo dev di fase MVP — auto-deploy dari Git, healthcheck bawaan, tanpa overhead patch OS/firewall/SSL manual |
| Process Manager | **Platform-native** (Railway/Render handle restart otomatis) | PM2 tersedia sebagai fallback jika pindah ke VPS di Fase 2 |
| DNS/SSL/Proxy | **Cloudflare (Free Tier)** | SSL otomatis, proteksi anti-DDoS, caching gambar menu |
| Cron | **Node-cron (di dalam app server)** | Cek meja expired tiap 2 menit, kalkulasi payout harian pukul 23:59 |

> **Catatan VPS:** Hosting VPS lokal Indonesia valid untuk mengurangi latensi dan biaya jangka panjang, namun membawa overhead ops signifikan (patch OS, firewall, graceful deploy, disk monitoring, backup konfigurasi) yang bersaing langsung dengan waktu pengembangan fitur. Direkomendasikan dievaluasi setelah Fase MVP selesai dan ada revenue.

### 15.4 External Services
| Komponen | Pilihan | Peran |
|---|---|---|
| Payment Gateway | **Midtrans Snap API** | QRIS & VA (BCA, Mandiri, BRI, BNI). Dipilih atas Xendit karena dokumentasi & adopsi lebih luas di Indonesia |
| WhatsApp | **Fonnte** (Rp66.000/bln) | Struk, notifikasi kasir, laporan omset — di belakang adapter (Bagian 7) |
| Error Tracking | **Sentry (Free Tier)** | Deteksi bug, kegagalan webhook, error JS real-time |

---

## 16. Implementation Roadmap (Phased)

**Fase 1 — MVP Core (Minggu 1–4):**
- **Minggu 1:** Setup DB Supabase, DDL schema (Bagian 12), RLS policy (Bagian 13), JWT custom claims, autentikasi multi-role.
- **Minggu 2:** RPC lock meja atomik (Bagian 14.1), modul reservasi meja, menu builder + varian/notes, integrasi checkout (Midtrans Snap, dynamic fee).
- **Minggu 3:** Webhook gateway (signature verification + idempotency), KDS realtime (Supabase Realtime), integrasi WA (Fonnte via adapter).
- **Minggu 4:** Deploy ke Railway/Render + Cloudflare, cron cleanup expired locks (Bagian 14.2), rekap saldo + ekspor CSV payout manual, uji coba end-to-end di 1 resto pilot.

**Fase 2 — Scale & Automation (Minggu 5–8):**
- Disbursement otomatis (Midtrans Iris / Xendit Payouts).
- Cetak struk fisik (Web Bluetooth / ESC-POS thermal printing).
- Dashboard analitik: menu terlaris, jam sibuk, retensi pelanggan.
- Evaluasi migrasi WA ke WhatsApp Cloud API resmi.
- Evaluasi migrasi hosting ke VPS lokal jika volume & kapasitas ops sudah ada.

---

## 17. Keputusan yang Sudah Ditutup

> Semua item di bawah ini **tidak perlu dibahas ulang** selama development Fase 1. Perubahan hanya boleh dilakukan dengan revisi PRD bernomor versi baru.

| Item | Keputusan Final | Catatan |
|---|---|---|
| Hosting fase MVP | **Railway / Render** | VPS lokal dievaluasi di Fase 2 |
| ORM | **Prisma** | Drizzle valid sebagai alternatif di Fase 2 jika ada kebutuhan kontrol SQL native |
| Payment Gateway primary | **Midtrans Snap API** | Xendit sebagai fallback jika ada rate lebih baik |
| Trigger mulai masak | **15 menit** sebelum `arrival_time`, disimpan di `cook_trigger_minutes` per resto | Configurable oleh Resto Owner |
| RPC locking meja | **Wajib selesai (Bagian 14.1)** sebelum modul reservasi bisa jalan | — |
| Fee VA | **Rp5.500** (dinaikkan dari Rp5.000) | Buffer margin agar tidak tipis sekali |
| `order_status` default | **`'pending'`** — bukan `'received'`; `'received'` hanya di-set backend post-webhook | Lihat Bagian 4 |
| `grace_period_until` | Dihitung **server-side**: `arrival_time + INTERVAL '15 minutes'` | Tidak boleh dari client input |
| `payment_reference_id` | Wajib ada **`UNIQUE` constraint** | Idempotency webhook Midtrans |
| Kolom `variants` menu | **`variants JSONB DEFAULT '[]'`** di `menu_items` | Snapshot ke `selected_variants` di `order_items` saat order dibuat |
| JWT custom claims | **`restaurant_id` + `role`** di `app_metadata` | Digunakan oleh semua RLS policy (Bagian 13) |
| Subscription tracking | **Tabel `subscriptions` terpisah** dari `restaurants` | Menyimpan history period & expiry date per resto |
| Auth customer | **Login wajib sebelum checkout** (email/magic link); browse & table map boleh tanpa login | Kolom `customer_user_id` di `orders` mengikat order ke akun; RLS `customer_user_id = auth.uid()` |
| State OCCUPIED di web customer | **RESERVED & OCCUPIED sama-sama tampil "Tidak Tersedia"** di table map customer | Di KDS kasir keduanya dibedakan; tamu OCCUPIED tidak bisa dan tidak perlu pesan ulang via web |
| Trigger LOCKED | **Saat customer klik "Lanjut Checkout"** — bukan saat browse/milih menu | Customer yang lebih cepat checkout menyalip yang masih browse — disengaja dan adil |
| Jumlah halaman web | **14 halaman** (lihat Bagian 18) | 13 original + 1 tambahan: Pesanan Saya (`/pesanan-saya`) |

---

## 18. Site Architecture (14 Halaman)

> Urutan nomor mencerminkan prioritas build, bukan urutan navigasi.

### 18.1 Customer-Facing (Mobile First)

| No | Nama Halaman | Route / URL | Target Perangkat | Fungsi & Komponen Kunci |
|---|---|---|---|---|
| 1 | Resto Directory & Landing | `/` | Mobile & Desktop | Pencarian resto, filter kategori, badge indikator status meja live per resto |
| 2 | Katalog Resto & Denah Meja | `/[resto-slug]` | Mobile First | Grid denah meja interaktif (2 warna customer: bisa dipilih vs tidak tersedia; LOCKED tampil countdown), tab kategori menu, modal varian & notes |
| 3 | Checkout & Table Lock | `/[resto-slug]/checkout` | Mobile First | **LOCKED dipicu di sini.** Form nama, WA, jam datang, timer countdown 10 menit, rincian biaya dinamis, checkbox non-refundable |
| 4 | Payment & Live Tracking | `/[resto-slug]/order/[id]` | Mobile First | Tampilan QRIS / nomor VA, stepper status masak real-time (`received → cooking → ready → completed`), tombol arah lokasi |
| 4b | Riwayat Pesanan Saya | `/pesanan-saya` | Mobile First | Daftar semua pesanan aktif & riwayat milik customer yang sedang login (wajib authenticated). Link ke halaman 4 per order |

### 18.2 Auth

| No | Nama Halaman | Route / URL | Target Perangkat | Fungsi & Komponen Kunci |
|---|---|---|---|---|
| 7 | Login & Register | `/login` | Mobile & Desktop | Satu halaman, dua flow: **Customer** — input email → magic link (tanpa password); **Staff/Owner** — input email + password. Sistem mendeteksi role dari `app_metadata` setelah login dan redirect ke tujuan yang benar (`?next=...` untuk customer, `/dashboard` untuk staff). |

### 18.3 Dashboard Resto (Staff & Owner)

| No | Nama Halaman | Route / URL | Target Perangkat | Fungsi & Komponen Kunci |
|---|---|---|---|---|
| 5 | Kitchen Display System (KDS) | `/dashboard/kds` | Tablet / Desktop | Kartu antrean pesanan real-time, audio alert, tombol progres masak, tombol trigger no-show |
| 6 | Live Table Floor Management | `/dashboard/tables` | Tablet / Desktop | Visual denah meja **4 warna penuh** (Vacant / Locked / Reserved / Occupied), tombol override manual kasir untuk walk-in |
| 8 | Menu & Variant Builder | `/dashboard/menu` | Desktop | CRUD kategori/menu, upload foto, toggle stok habis, editor JSONB varian (`variants`) |
| 9 | Pengaturan Meja & QR Code | `/dashboard/settings/tables` | Desktop | Tambah/edit nomor & kapasitas meja, generator cetak stiker QR meja instan |
| 10 | Laporan Keuangan & Saldo | `/dashboard/finance` | Desktop | Grafik omset, log pembukuan (`balance_ledgers`), status langganan, tombol ekspor CSV payout H+1 |
| 11 | Profil & Operasional Resto | `/dashboard/settings` | Desktop | Jam buka/tutup, rekening bank, ID grup WhatsApp, input `cook_trigger_minutes`, profil resto |

### 18.4 Super Admin

| No | Nama Halaman | Route / URL | Target Perangkat | Fungsi & Komponen Kunci |
|---|---|---|---|---|
| 12 | Super Admin Overview | `/super-admin` | Desktop | Total GMV transaksi platform, rekap laba biaya layanan, metrik sistem |
| 13 | Manajemen Kemitraan Resto | `/super-admin/tenants` | Desktop | Daftar seluruh resto, status langganan bulanan (`active`/`expired`), tombol suspend |

### 18.5 Catatan Implementasi Site Architecture

- **Protected routes:** semua route `/dashboard/*` dan `/super-admin/*` wajib middleware auth check. Redirect ke `/login` jika tidak ada session.
- **`/pesanan-saya`** wajib authenticated customer — redirect ke `/login?next=/pesanan-saya` jika belum login.
- **Halaman 2 (Katalog Resto)** menampilkan 2 warna meja untuk customer, bukan 4 — detail state (LOCKED vs RESERVED vs OCCUPIED) hanya visible di `/dashboard/tables` kasir.
- **LOCKED countdown** di halaman 2 adalah opsional visual — tampilkan timer sisa dari `locked_until` via Supabase Realtime agar customer tahu kapan meja mungkin tersedia lagi.
- **Halaman 4 & 4b** saling berkaitan: halaman 4b list pesanan → klik salah satu → masuk ke halaman 4 untuk detail tracking.
