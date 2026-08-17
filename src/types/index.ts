export type TableStatus = "vacant" | "locked" | "reserved" | "occupied";

export type OrderStatus =
  | "pending"
  | "received"
  | "cooking"
  | "ready"
  | "completed"
  | "converted_takeaway";

export type PaymentStatus = "pending" | "paid" | "expired" | "failed";

export type PaymentMethod =
  | "qris"
  | "bca_va"
  | "mandiri_va"
  | "bri_va"
  | "bni_va";

export interface VariantOption {
  name: string;
  options: string[];
}

export interface SelectedVariant {
  name: string;
  selected: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  phone_whatsapp: string;
  owner_phone: string;
  telegram_chat_id?: string | null;
  wa_group_id?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_holder?: string | null;
  cook_trigger_minutes: number;
  subscription_status: string;
  created_at: string;
  // Computed / UI fields
  distance_km?: number;
  rating?: number;
  price_range?: string;
  available_tables_count?: number;
  total_tables_count?: number;
  category?: string;
  image_url?: string;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  status: TableStatus;
  locked_until?: string | null;
  qr_code_url?: string | null;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_name: string;
  name: string;
  price: number;
  image_url?: string | null;
  is_available: boolean;
  variants: VariantOption[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string | null;
  item_name: string;
  item_price: number;
  quantity: number;
  selected_variants: SelectedVariant[];
  special_notes?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id?: string | null;
  customer_user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  arrival_time: string;
  grace_period_until: string;
  subtotal_amount: number;
  platform_fee: number;
  total_amount: number;
  payment_method?: PaymentMethod | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_reference_id?: string | null;
  created_at: string;
  order_items?: OrderItem[];
  table?: RestaurantTable | null;
  restaurant?: Restaurant | null;
}

export interface BalanceLedger {
  id: string;
  restaurant_id: string;
  order_id?: string | null;
  amount: number;
  type: "credit" | "debit";
  description?: string | null;
  status: "completed" | "pending";
  created_at: string;
}

export interface UserCustomClaims {
  restaurant_id?: string;
  role?: "customer" | "staff" | "owner" | "super_admin";
}
