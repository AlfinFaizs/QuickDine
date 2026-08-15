// src/features/kds/kds-data.ts
// Data tipe & mock pesanan untuk KDS Dapur

export type KdsOrderStatus = "received" | "cooking" | "ready";

export interface KdsOrderItem {
  name: string;
  qty: number;
  notes?: string;
}

export interface KdsOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  arrivalTime: string;        // "12:30" (HH:mm)
  status: KdsOrderStatus;
  items: KdsOrderItem[];
  orderedAt: string;          // ISO timestamp untuk hitung elapsed
}

// Waktu sekarang sebagai anchor untuk demo
const now = new Date();
const minusMinutes = (m: number) =>
  new Date(now.getTime() - m * 60_000).toISOString();

export const INITIAL_KDS_ORDERS: KdsOrder[] = [
  {
    id: "kds-1",
    tableNumber: "04",
    customerName: "Alfin Faiz",
    customerPhone: "08123456789",
    arrivalTime: (() => {
      const d = new Date(now.getTime() + 8 * 60_000);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    })(),
    status: "cooking",
    orderedAt: minusMinutes(12),
    items: [
      { name: "Kopi Kenangan Mantan", qty: 2, notes: "Less Sugar, Ice Normal" },
      { name: "Roti Coklat Klasik", qty: 1 },
    ],
  },
  {
    id: "kds-2",
    tableNumber: "02",
    customerName: "Budi Santoso",
    customerPhone: "08234567890",
    arrivalTime: (() => {
      const d = new Date(now.getTime() + 22 * 60_000);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    })(),
    status: "received",
    orderedAt: minusMinutes(3),
    items: [
      { name: "Avocado Coffee", qty: 1, notes: "Extra Shot Espresso" },
      { name: "Matcha Latte", qty: 2 },
      { name: "Croissant Butter", qty: 1 },
    ],
  },
  {
    id: "kds-3",
    tableNumber: "07",
    customerName: "Citra Dewi",
    customerPhone: "08345678901",
    arrivalTime: (() => {
      const d = new Date(now.getTime() + 35 * 60_000);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    })(),
    status: "received",
    orderedAt: minusMinutes(1),
    items: [
      { name: "Spaghetti Carbonara", qty: 1 },
      { name: "Fresh Orange Juice", qty: 2, notes: "Tanpa Es" },
    ],
  },
  {
    id: "kds-4",
    tableNumber: "01",
    customerName: "Dimas Pratama",
    customerPhone: "08456789012",
    arrivalTime: (() => {
      const d = new Date(now.getTime() - 5 * 60_000);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    })(),
    status: "ready",
    orderedAt: minusMinutes(28),
    items: [
      { name: "Nasi Goreng Spesial", qty: 1, notes: "Level Pedas 2" },
      { name: "Es Teh Manis", qty: 1 },
    ],
  },
];
