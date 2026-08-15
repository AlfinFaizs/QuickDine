// src/features/super-admin/super-admin-data.ts
// Tipe data dan dataset untuk portal Super Admin Platform QuickDine

export type TenantStatus = "active" | "pending_approval" | "suspended";

export interface SuperAdminTenant {
  id: string;
  name: string;
  category: string;
  ownerName: string;
  phone: string;
  address: string;
  tableCount: number;
  totalGmv: number;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  joinedDate: string;
  status: TenantStatus;
}

export interface PendingPartnerApplication {
  id: string;
  restaurantName: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
  tableCount: number;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  appliedDate: string;
}

export interface SuperAdminGlobalTransaction {
  id: string;
  orderNumber: string;
  restaurantName: string;
  customerName: string;
  createdAt: string;
  paymentMethod: "QRIS" | "Mandiri VA" | "BCA VA" | "BRI VA" | "BNI VA";
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  payoutStatus: "settled" | "pending_payout" | "paid_out";
}

export interface SuperAdminKPI {
  totalGmv: number;
  totalFeeRevenue: number;
  totalActiveTenants: number;
  pendingVerifications: number;
  successRate: number;
  totalOrdersToday: number;
}

export const INITIAL_SUPER_ADMIN_KPI: SuperAdminKPI = {
  totalGmv: 842500000,
  totalFeeRevenue: 324500000,
  totalActiveTenants: 122,
  pendingVerifications: 3,
  successRate: 99.4,
  totalOrdersToday: 1420,
};

export const INITIAL_PENDING_APPLICATIONS: PendingPartnerApplication[] = [
  {
    id: "app-01",
    restaurantName: "Warung Bu Kris Senopati",
    category: "Indonesian Sambal & Penyet",
    ownerName: "Ibu Kristina Wahyudi",
    ownerEmail: "bukris.senopati@gmail.com",
    ownerPhone: "0812-9988-1122",
    address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
    tableCount: 16,
    bankName: "BCA",
    bankAccount: "8820-9911-22",
    accountHolder: "PT Kuliner Kris Bersama",
    appliedDate: "15 Agu 2026, 16:30",
  },
  {
    id: "app-02",
    restaurantName: "Mie Gacoan Tebet",
    category: "Spicy Noodle & Dimsum",
    ownerName: "Hendra Gunawan",
    ownerEmail: "gacoan.tebet@gmail.com",
    ownerPhone: "0813-4455-6677",
    address: "Jl. Tebet Raya No. 45, Jakarta Selatan",
    tableCount: 24,
    bankName: "Bank Mandiri",
    bankAccount: "137-00-998877-1",
    accountHolder: "PT Gacoan Retail Nusantara",
    appliedDate: "15 Agu 2026, 15:10",
  },
  {
    id: "app-03",
    restaurantName: "Lawless Burger Bar Kemang",
    category: "Western & Burgers",
    ownerName: "Sammy Bramantyo",
    ownerEmail: "lawless.kemang@gmail.com",
    ownerPhone: "0818-7788-9900",
    address: "Jl. Kemang Selatan VIII No. 67, Jakarta Selatan",
    tableCount: 14,
    bankName: "BCA",
    bankAccount: "604-123-9988",
    accountHolder: "PT Lawless Jakarta Boga",
    appliedDate: "15 Agu 2026, 11:20",
  },
];

export const INITIAL_SUPER_ADMIN_TENANTS: SuperAdminTenant[] = [
  {
    id: "resto-sks",
    name: "Sate Khas Senayan Pakubuwono",
    category: "Indonesian Satay",
    ownerName: "PT Rasa Kuliner Nusantara",
    phone: "0812-3456-7890",
    address: "Jl. Pakubuwono VI No. 10, Kebayoran Baru, Jakarta Selatan",
    tableCount: 10,
    totalGmv: 142500000,
    bankName: "BCA",
    bankAccount: "8820-1928-33",
    accountHolder: "PT Rasa Kuliner Nusantara",
    joinedDate: "10 Jun 2026",
    status: "active",
  },
  {
    id: "resto-1",
    name: "Kopi Kenangan Senopati",
    category: "Coffee & Cafe",
    ownerName: "Edward Tirtanata",
    phone: "0812-8899-1001",
    address: "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan",
    tableCount: 8,
    totalGmv: 89400000,
    bankName: "BCA",
    bankAccount: "542-019-8833",
    accountHolder: "PT Bumi Berkah Boga",
    joinedDate: "15 Jun 2026",
    status: "active",
  },
  {
    id: "resto-2",
    name: "Bakmi GM Grand Indonesia",
    category: "Asian & Noodle",
    ownerName: "PT Griya Mie Bersama",
    phone: "0812-8899-1002",
    address: "Grand Indonesia West Mall Lt. LG, Jakarta Pusat",
    tableCount: 12,
    totalGmv: 112000000,
    bankName: "Bank Mandiri",
    bankAccount: "118-00-445566-2",
    accountHolder: "PT Griya Mie Bersama",
    joinedDate: "18 Jun 2026",
    status: "active",
  },
  {
    id: "resto-3",
    name: "Holycow! Steakhouse Senopati",
    category: "Steak & Grill",
    ownerName: "Wybren Heeres",
    phone: "0812-8899-1003",
    address: "Jl. Senopati No. 34, Jakarta Selatan",
    tableCount: 10,
    totalGmv: 98000000,
    bankName: "BCA",
    bankAccount: "218-990-1122",
    accountHolder: "PT Holycow Meatlovers",
    joinedDate: "20 Jun 2026",
    status: "active",
  },
  {
    id: "resto-4",
    name: "Pagi Sore Kemang",
    category: "Padang & Minang",
    ownerName: "H. Syamsudin",
    phone: "0812-8899-1004",
    address: "Jl. Kemang Raya No. 12, Jakarta Selatan",
    tableCount: 14,
    totalGmv: 165000000,
    bankName: "Bank Mandiri",
    bankAccount: "124-00-889900-3",
    accountHolder: "PT Pagi Sore Nusantara",
    joinedDate: "22 Jun 2026",
    status: "active",
  },
  {
    id: "resto-5",
    name: "Bebek Kaleyo Rawamangun",
    category: "Indonesian Duck & Poultry",
    ownerName: "Fajar Susanto",
    phone: "0812-8899-1005",
    address: "Jl. Pemuda No. 290, Rawamangun, Jakarta Timur",
    tableCount: 18,
    totalGmv: 78000000,
    bankName: "BRI",
    bankAccount: "034-101-002233-50-1",
    accountHolder: "PT Kaleyo Kuliner Jaya",
    joinedDate: "01 Jul 2026",
    status: "active",
  },
  {
    id: "resto-6",
    name: "Kafe Kopi Lama Tebet",
    category: "Coffee & Cafe",
    ownerName: "Rudi Hartono",
    phone: "0856-1122-3344",
    address: "Jl. Tebet Barat Dalam No. 15, Jakarta Selatan",
    tableCount: 6,
    totalGmv: 15400000,
    bankName: "BCA",
    bankAccount: "8820-1100-22",
    accountHolder: "Rudi Hartono",
    joinedDate: "05 Jul 2026",
    status: "suspended", // Suspended example
  },
];

export const INITIAL_GLOBAL_TRANSACTIONS: SuperAdminGlobalTransaction[] = [
  {
    id: "gtx-9901",
    orderNumber: "QD-8821",
    restaurantName: "Sate Khas Senayan Pakubuwono",
    customerName: "Budi Santoso",
    createdAt: "15 Agu 2026, 14:32",
    paymentMethod: "QRIS",
    grossAmount: 450000,
    platformFee: 1500,
    netAmount: 448500,
    payoutStatus: "pending_payout",
  },
  {
    id: "gtx-9902",
    orderNumber: "QD-8820",
    restaurantName: "Pagi Sore Kemang",
    customerName: "PT Maju Bersama (Rapat)",
    createdAt: "15 Agu 2026, 14:15",
    paymentMethod: "Mandiri VA",
    grossAmount: 1250000,
    platformFee: 5500,
    netAmount: 1244500,
    payoutStatus: "pending_payout",
  },
  {
    id: "gtx-9903",
    orderNumber: "QD-8819",
    restaurantName: "Kopi Kenangan Senopati",
    customerName: "Siti Rahmawati",
    createdAt: "15 Agu 2026, 13:50",
    paymentMethod: "QRIS",
    grossAmount: 120000,
    platformFee: 1500,
    netAmount: 118500,
    payoutStatus: "pending_payout",
  },
  {
    id: "gtx-9904",
    orderNumber: "QD-8818",
    restaurantName: "Holycow! Steakhouse",
    customerName: "Andi Pratama",
    createdAt: "15 Agu 2026, 13:10",
    paymentMethod: "BCA VA",
    grossAmount: 850000,
    platformFee: 5500,
    netAmount: 844500,
    payoutStatus: "pending_payout",
  },
  {
    id: "gtx-9905",
    orderNumber: "QD-8817",
    restaurantName: "Bakmi GM Grand Indonesia",
    customerName: "Dewi Lestari",
    createdAt: "15 Agu 2026, 12:45",
    paymentMethod: "QRIS",
    grossAmount: 320000,
    platformFee: 1500,
    netAmount: 318500,
    payoutStatus: "settled",
  },
];
