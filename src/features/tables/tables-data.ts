// src/features/tables/tables-data.ts
// Tipe data & mock meja untuk halaman Denah Meja Kasir

export type TableStatus = "vacant" | "locked" | "reserved" | "occupied";

export interface DashboardTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  guestName?: string;
  eta?: string;          // "12:30" untuk reserved, "Sisa 5 mnt" untuk locked
  orderId?: string;
  phone?: string;
}

export const INITIAL_TABLES: DashboardTable[] = [
  { id: "1", number: "01", capacity: 2, status: "occupied", guestName: "Dimas Pratama", eta: "Sedang Makan", phone: "08456789012", orderId: "ord-101" },
  { id: "2", number: "02", capacity: 4, status: "reserved", guestName: "Budi Santoso", eta: "13:45", phone: "08234567890", orderId: "ord-102" },
  { id: "3", number: "03", capacity: 2, status: "locked", guestName: "Sedang Checkout", eta: "Sisa 7 mnt" },
  { id: "4", number: "04", capacity: 4, status: "cooking", guestName: "Alfin Faiz", eta: "12:30", phone: "08123456789", orderId: "ord-103" } as unknown as DashboardTable,
  { id: "5", number: "05", capacity: 6, status: "vacant" },
  { id: "6", number: "06", capacity: 2, status: "vacant" },
  { id: "7", number: "07", capacity: 4, status: "reserved", guestName: "Citra Dewi", eta: "14:15", phone: "08345678901", orderId: "ord-104" },
  { id: "8", number: "08", capacity: 8, status: "vacant" },
  { id: "9", number: "09", capacity: 2, status: "occupied", guestName: "Eko Susanto", eta: "Sedang Makan", phone: "08567890123", orderId: "ord-105" },
  { id: "10", number: "10", capacity: 4, status: "vacant" },
];

export const STATUS_CONFIG: Record<
  TableStatus,
  { label: string; bg: string; border: string; badge: string; dot: string }
> = {
  vacant: {
    label: "Kosong",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
  locked: {
    label: "Locked (Checkout)",
    bg: "bg-amber-50",
    border: "border-amber-300",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400 animate-pulse",
  },
  reserved: {
    label: "Reserved (Sudah Bayar)",
    bg: "bg-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
  },
  occupied: {
    label: "Terisi (Sedang Makan)",
    bg: "bg-slate-50",
    border: "border-slate-400",
    badge: "bg-slate-200 text-slate-800",
    dot: "bg-slate-600",
  },
};
