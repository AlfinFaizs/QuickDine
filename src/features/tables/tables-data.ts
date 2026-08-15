export type TableStatus = "vacant" | "locked" | "reserved" | "occupied" | "maintenance";
export type TableArea = "Indoor Utama" | "Outdoor Garden" | "VIP Room";

export interface ActiveTableOrder {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  arrivalTime: string;
  kitchenStatus: "received" | "cooking" | "ready" | "completed";
  totalAmount: number;
  paymentMethod: string;
  lockRemainingSeconds?: number;
  seatedSince?: string;
  items: Array<{ name: string; qty: number; variant?: string }>;
}

export interface DashboardTable {
  id: string;
  number: string;
  area: TableArea;
  capacity: number;
  status: TableStatus;
  activeOrder?: ActiveTableOrder;
}

export const INITIAL_DASHBOARD_TABLES: DashboardTable[] = [
  {
    id: "tbl-01",
    number: "01",
    area: "Indoor Utama",
    capacity: 2,
    status: "vacant",
  },
  {
    id: "tbl-02",
    number: "02",
    area: "Indoor Utama",
    capacity: 4,
    status: "reserved",
    activeOrder: {
      orderId: "ord-102",
      orderNumber: "QD-8842",
      customerName: "Sarah Wijaya",
      customerPhone: "0813-1122-3344",
      guestCount: 4,
      arrivalTime: "12:20 WIB",
      kitchenStatus: "ready",
      totalAmount: 145000,
      paymentMethod: "QRIS",
      items: [
        { name: "Avocado Coffee Float", qty: 2, variant: "Normal Sweet" },
        { name: "Matcha Oat Latte", qty: 2, variant: "No Sugar" },
        { name: "French Fries Bolognese", qty: 1 },
      ],
    },
  },
  {
    id: "tbl-03",
    number: "03",
    area: "Indoor Utama",
    capacity: 2,
    status: "locked",
    activeOrder: {
      orderId: "ord-temp-1",
      orderNumber: "LOCK-391",
      customerName: "Pelanggan Online (Checkout)",
      customerPhone: "0819-xxxx-xxxx",
      guestCount: 2,
      arrivalTime: "12:45 WIB",
      kitchenStatus: "received",
      totalAmount: 58000,
      paymentMethod: "Menunggu Pembayaran",
      lockRemainingSeconds: 435, // ~7 minutes left
      items: [{ name: "Kopi Kenangan Mantan", qty: 2 }],
    },
  },
  {
    id: "tbl-04",
    number: "04",
    area: "Indoor Utama",
    capacity: 4,
    status: "reserved",
    activeOrder: {
      orderId: "ord-101",
      orderNumber: "QD-8841",
      customerName: "Alfin Faiz",
      customerPhone: "0812-9876-5432",
      guestCount: 2,
      arrivalTime: "12:15 WIB",
      kitchenStatus: "ready",
      totalAmount: 78000,
      paymentMethod: "QRIS",
      items: [
        { name: "Kopi Kenangan Mantan", qty: 2, variant: "Less Sugar (50%)" },
        { name: "Toast Coklat Klasik", qty: 1 },
      ],
    },
  },
  {
    id: "tbl-05",
    number: "05",
    area: "Indoor Utama",
    capacity: 6,
    status: "occupied",
    activeOrder: {
      orderId: "ord-walkin-1",
      orderNumber: "WLK-042",
      customerName: "Keluarga Pak Budi",
      customerPhone: "-",
      guestCount: 5,
      arrivalTime: "11:45 WIB",
      seatedSince: "40 menit yang lalu",
      kitchenStatus: "completed",
      totalAmount: 245000,
      paymentMethod: "Walk-in Tunai",
      items: [
        { name: "Kopi Kenangan Mantan Large", qty: 3 },
        { name: "Matcha Latte", qty: 2 },
        { name: "Roti Coklat Klasik", qty: 4 },
      ],
    },
  },
  {
    id: "tbl-06",
    number: "06",
    area: "Outdoor Garden",
    capacity: 2,
    status: "vacant",
  },
  {
    id: "tbl-07",
    number: "07",
    area: "Outdoor Garden",
    capacity: 4,
    status: "reserved",
    activeOrder: {
      orderId: "ord-103",
      orderNumber: "QD-8843",
      customerName: "Dimas Pratama",
      customerPhone: "0877-5566-7788",
      guestCount: 2,
      arrivalTime: "12:35 WIB",
      kitchenStatus: "cooking",
      totalAmount: 92000,
      paymentMethod: "Virtual Account",
      items: [
        { name: "Caramel Macchiato", qty: 2 },
        { name: "Croissant Almond", qty: 2 },
      ],
    },
  },
  {
    id: "tbl-08",
    number: "08",
    area: "Outdoor Garden",
    capacity: 4,
    status: "vacant",
  },
  {
    id: "tbl-09",
    number: "09",
    area: "VIP Room",
    capacity: 8,
    status: "occupied",
    activeOrder: {
      orderId: "ord-105",
      orderNumber: "QD-8845",
      customerName: "Clarissa Putri & Tim",
      customerPhone: "0856-7788-9900",
      guestCount: 6,
      arrivalTime: "12:10 WIB",
      seatedSince: "15 menit yang lalu",
      kitchenStatus: "ready",
      totalAmount: 310000,
      paymentMethod: "QRIS",
      items: [
        { name: "Hazelnut Choco Milk", qty: 4 },
        { name: "Americano Ice", qty: 2 },
        { name: "Platter Snack VIP", qty: 1 },
      ],
    },
  },
  {
    id: "tbl-10",
    number: "10",
    area: "VIP Room",
    capacity: 8,
    status: "vacant",
  },
];
