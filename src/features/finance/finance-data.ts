// src/features/finance/finance-data.ts
// Tipe data dan dataset keuangan & ledger transaksi restoran QuickDine

export type PaymentMethod = "QRIS" | "Mandiri VA" | "BCA VA" | "BRI VA" | "BNI VA";

export interface FinanceTransaction {
  id: string;
  orderNumber: string;
  createdAt: string; // e.g. "15 Agu 2026, 14:32"
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  grossAmount: number; // Nilai kotor dibayar customer
  platformFee: number; // Potongan fee platform (QRIS Rp 1.500 / VA Rp 5.500)
  netAmount: number;   // Saldo bersih hak resto
  payoutStatus: "settled" | "pending_payout" | "paid_out";
}

export interface FinanceKPISummary {
  totalGross: number;
  totalFee: number;
  totalNet: number;
  payoutStatusDescription: string;
  nextPayoutDate: string;
  payoutBankName: string;
  payoutBankAccount: string;
}

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: "tx-101",
    orderNumber: "QD-8821",
    createdAt: "15 Agu 2026, 14:32",
    customerName: "Budi Santoso",
    customerPhone: "0812-8899-0011",
    paymentMethod: "QRIS",
    grossAmount: 450000,
    platformFee: 1500,
    netAmount: 448500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-102",
    orderNumber: "QD-8820",
    createdAt: "15 Agu 2026, 14:15",
    customerName: "PT Maju Bersama (Rapat)",
    customerPhone: "0813-2233-4455",
    paymentMethod: "Mandiri VA",
    grossAmount: 1250000,
    platformFee: 5500,
    netAmount: 1244500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-103",
    orderNumber: "QD-8819",
    createdAt: "15 Agu 2026, 13:50",
    customerName: "Siti Rahmawati",
    customerPhone: "0857-1122-3344",
    paymentMethod: "QRIS",
    grossAmount: 120000,
    platformFee: 1500,
    netAmount: 118500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-104",
    orderNumber: "QD-8818",
    createdAt: "15 Agu 2026, 13:10",
    customerName: "Andi Pratama",
    customerPhone: "0818-4455-6677",
    paymentMethod: "BCA VA",
    grossAmount: 850000,
    platformFee: 5500,
    netAmount: 844500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-105",
    orderNumber: "QD-8817",
    createdAt: "15 Agu 2026, 12:45",
    customerName: "Dewi Lestari",
    customerPhone: "0811-9988-7766",
    paymentMethod: "QRIS",
    grossAmount: 320000,
    platformFee: 1500,
    netAmount: 318500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-106",
    orderNumber: "QD-8816",
    createdAt: "15 Agu 2026, 12:20",
    customerName: "Fajar Nugraha",
    customerPhone: "0821-3344-5566",
    paymentMethod: "QRIS",
    grossAmount: 215000,
    platformFee: 1500,
    netAmount: 213500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-107",
    orderNumber: "QD-8815",
    createdAt: "15 Agu 2026, 11:55",
    customerName: "Hendro Wibowo",
    customerPhone: "0819-7766-5544",
    paymentMethod: "BNI VA",
    grossAmount: 640000,
    platformFee: 5500,
    netAmount: 634500,
    payoutStatus: "pending_payout",
  },
  {
    id: "tx-108",
    orderNumber: "QD-8814",
    createdAt: "14 Agu 2026, 19:40",
    customerName: "Rina Kusuma",
    customerPhone: "0812-3322-1100",
    paymentMethod: "QRIS",
    grossAmount: 280000,
    platformFee: 1500,
    netAmount: 278500,
    payoutStatus: "paid_out",
  },
  {
    id: "tx-109",
    orderNumber: "QD-8813",
    createdAt: "14 Agu 2026, 18:30",
    customerName: "Bambang Tri",
    customerPhone: "0856-7788-9900",
    paymentMethod: "Mandiri VA",
    grossAmount: 510000,
    platformFee: 5500,
    netAmount: 504500,
    payoutStatus: "paid_out",
  },
];

export const INITIAL_FINANCE_SUMMARY: FinanceKPISummary = {
  totalGross: 4635000,
  totalFee: 24000,
  totalNet: 4611000,
  payoutStatusDescription: "Dijadwalkan Besok, 09:00 WIB (H+1)",
  nextPayoutDate: "16 Agustus 2026",
  payoutBankName: "Bank Central Asia (BCA)",
  payoutBankAccount: "8820-1928-33 (PT Rasa Kuliner Nusantara)",
};
