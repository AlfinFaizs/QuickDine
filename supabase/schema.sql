-- ============================================================
-- QuickDine / PesanMeja — Database Schema, RLS & RPC Functions
-- Versi: 4.2 (Final)
-- Target: PostgreSQL (Supabase)
-- ============================================================

-- 1. Tabel Restoran (Multi-Tenant Master)
CREATE TABLE IF NOT EXISTS restaurants (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 VARCHAR(255) NOT NULL,
    slug                 VARCHAR(100) UNIQUE NOT NULL,
    phone_whatsapp       VARCHAR(20) NOT NULL,
    owner_phone          VARCHAR(20) NOT NULL,
    telegram_chat_id     VARCHAR(100),
    wa_group_id          VARCHAR(100),
    bank_name            VARCHAR(50),
    bank_account_number  VARCHAR(50),
    bank_account_holder  VARCHAR(100),
    cook_trigger_minutes INTEGER DEFAULT 15,
    subscription_status  VARCHAR(20) DEFAULT 'active',
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Langganan (History Subscription per Resto)
CREATE TABLE IF NOT EXISTS subscriptions (
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
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number  VARCHAR(20) NOT NULL,
    capacity      INT DEFAULT 2,
    status        VARCHAR(20) DEFAULT 'vacant', -- vacant, locked, reserved, occupied
    locked_until  TIMESTAMP WITH TIME ZONE,
    qr_code_url   TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_resto_table UNIQUE(restaurant_id, table_number)
);

-- 4. Tabel Master Menu
CREATE TABLE IF NOT EXISTS menu_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    price         NUMERIC(12, 2) NOT NULL,
    image_url     TEXT,
    is_available  BOOLEAN DEFAULT TRUE,
    variants      JSONB DEFAULT '[]',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Header Pesanan
CREATE TABLE IF NOT EXISTS orders (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id        UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id             UUID REFERENCES restaurant_tables(id),
    customer_user_id     UUID REFERENCES auth.users(id),
    customer_name        VARCHAR(100) NOT NULL,
    customer_phone       VARCHAR(20) NOT NULL,
    arrival_time         TIMESTAMP WITH TIME ZONE NOT NULL,
    grace_period_until   TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal_amount      NUMERIC(12, 2) NOT NULL,
    platform_fee         NUMERIC(12, 2) NOT NULL,
    total_amount         NUMERIC(12, 2) NOT NULL,
    payment_method       VARCHAR(30), -- qris, bca_va, mandiri_va, bri_va, bni_va
    payment_status       VARCHAR(20) DEFAULT 'pending', -- pending, paid, expired, failed
    order_status         VARCHAR(30) DEFAULT 'pending', -- pending, received, cooking, ready, completed, converted_takeaway
    payment_reference_id VARCHAR(100) UNIQUE,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Detail Pesanan
CREATE TABLE IF NOT EXISTS order_items (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id      UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name         VARCHAR(255) NOT NULL,
    item_price        NUMERIC(12, 2) NOT NULL,
    quantity          INT NOT NULL CHECK (quantity > 0),
    selected_variants JSONB DEFAULT '[]',
    special_notes     TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Ledger Saldo
CREATE TABLE IF NOT EXISTS balance_ledgers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id      UUID REFERENCES orders(id),
    amount        NUMERIC(12, 2) NOT NULL,
    type          VARCHAR(20) NOT NULL, -- credit, debit
    description   TEXT,
    status        VARCHAR(20) DEFAULT 'completed',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_resto ON subscriptions(restaurant_id, status, period_end);
CREATE INDEX IF NOT EXISTS idx_tables_resto        ON restaurant_tables(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_resto        ON orders(restaurant_id, payment_status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer     ON orders(customer_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(restaurant_id, order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_resto        ON balance_ledgers(restaurant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_menu_resto          ON menu_items(restaurant_id, is_available);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE restaurants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_ledgers   ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION auth_restaurant_id() RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'restaurant_id')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth_role() RETURNS TEXT AS $$
  SELECT auth.jwt() -> 'app_metadata' ->> 'role';
$$ LANGUAGE sql STABLE;

-- 1. Restaurants Policies
DROP POLICY IF EXISTS "resto_select_own" ON restaurants;
CREATE POLICY "resto_select_own" ON restaurants
  FOR SELECT TO authenticated
  USING (id = auth_restaurant_id() OR auth_role() = 'super_admin');

DROP POLICY IF EXISTS "resto_update_own" ON restaurants;
CREATE POLICY "resto_update_own" ON restaurants
  FOR UPDATE TO authenticated
  USING (id = auth_restaurant_id() AND auth_role() = 'owner');

-- 2. Restaurant Tables Policies
DROP POLICY IF EXISTS "tables_select_public" ON restaurant_tables;
CREATE POLICY "tables_select_public" ON restaurant_tables
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "tables_select_auth" ON restaurant_tables;
CREATE POLICY "tables_select_auth" ON restaurant_tables
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id() OR true);

DROP POLICY IF EXISTS "tables_manage_owner" ON restaurant_tables;
CREATE POLICY "tables_manage_owner" ON restaurant_tables
  FOR ALL TO authenticated
  USING (restaurant_id = auth_restaurant_id() AND auth_role() = 'owner');

-- 3. Menu Items Policies
DROP POLICY IF EXISTS "menu_select_public" ON menu_items;
CREATE POLICY "menu_select_public" ON menu_items
  FOR SELECT TO anon
  USING (is_available = true);

DROP POLICY IF EXISTS "menu_select_staff" ON menu_items;
CREATE POLICY "menu_select_staff" ON menu_items
  FOR SELECT TO authenticated
  USING (restaurant_id = auth_restaurant_id() OR is_available = true);

DROP POLICY IF EXISTS "menu_manage_owner" ON menu_items;
CREATE POLICY "menu_manage_owner" ON menu_items
  FOR ALL TO authenticated
  USING (restaurant_id = auth_restaurant_id() AND auth_role() = 'owner');

-- 4. Orders Policies
DROP POLICY IF EXISTS "orders_insert_customer" ON orders;
CREATE POLICY "orders_insert_customer" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (
    payment_status = 'pending'
    AND order_status = 'pending'
    AND customer_user_id = auth.uid()
  );

DROP POLICY IF EXISTS "orders_select_customer_own" ON orders;
CREATE POLICY "orders_select_customer_own" ON orders
  FOR SELECT TO authenticated
  USING (
    customer_user_id = auth.uid()
    OR restaurant_id = auth_restaurant_id()
    OR auth_role() = 'super_admin'
  );

DROP POLICY IF EXISTS "orders_update_status_staff" ON orders;
CREATE POLICY "orders_update_status_staff" ON orders
  FOR UPDATE TO authenticated
  USING (restaurant_id = auth_restaurant_id())
  WITH CHECK (restaurant_id = auth_restaurant_id());

-- 5. Order Items Policies
DROP POLICY IF EXISTS "order_items_insert_customer" ON order_items;
CREATE POLICY "order_items_insert_customer" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "order_items_select_auth" ON order_items;
CREATE POLICY "order_items_select_auth" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (
          orders.customer_user_id = auth.uid()
          OR orders.restaurant_id = auth_restaurant_id()
          OR auth_role() = 'super_admin'
        )
    )
  );

-- 6. Balance Ledgers Policies
DROP POLICY IF EXISTS "ledger_select_owner" ON balance_ledgers;
CREATE POLICY "ledger_select_owner" ON balance_ledgers
  FOR SELECT TO authenticated
  USING (
    restaurant_id = auth_restaurant_id() AND auth_role() = 'owner'
    OR auth_role() = 'super_admin'
  );

-- 7. Subscriptions Policies
DROP POLICY IF EXISTS "subscriptions_select_owner" ON subscriptions;
CREATE POLICY "subscriptions_select_owner" ON subscriptions
  FOR SELECT TO authenticated
  USING (
    restaurant_id = auth_restaurant_id()
    OR auth_role() = 'super_admin'
  );

-- ============================================================
-- RPC Functions
-- ============================================================

-- Atomic Table Lock
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
    AND status    = 'vacant'
  RETURNING * INTO v_result;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'TABLE_NOT_AVAILABLE'
      USING HINT = 'Meja sudah diambil atau sedang terkunci oleh customer lain.';
  END IF;

  RETURN v_result;
END;
$$;

-- Cron Cleanup for Expired Locked Tables
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

-- Set Table to Occupied (dipanggil saat customer check-in / pesanan aktif di meja)
CREATE OR REPLACE FUNCTION set_table_occupied(p_table_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE restaurant_tables
  SET status = 'occupied', locked_until = NULL
  WHERE id = p_table_id AND status = 'reserved';
END;
$$;

-- Set Table to Vacant (dipanggil saat order_status = completed atau staf mereset meja)
CREATE OR REPLACE FUNCTION release_table(p_table_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE restaurant_tables
  SET status = 'vacant', locked_until = NULL
  WHERE id = p_table_id;
END;
$$;
