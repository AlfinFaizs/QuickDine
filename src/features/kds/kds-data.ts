export type KdsOrderStatus = "received" | "cooking" | "ready" | "completed" | "converted_takeaway";
export type KdsArrivalStatus = "on_the_way" | "arrived" | "late_grace" | "tolerance_exceeded";

export interface KdsOrderItem {
  name: string;
  qty: number;
  variant?: string;
  notes?: string;
}

export interface KdsOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  orderedAt: string;
  arrivalTime: string;
  arrivalMinutesRemaining: number; // positive: minutes until ETA, negative: minutes late
  status: KdsOrderStatus;
  arrivalStatus: KdsArrivalStatus;
  lateMinutes: number;
  totalAmount: number;
  paymentMethod: "QRIS" | "Virtual Account";
  items: KdsOrderItem[];
  isCookAlarmTriggered?: boolean;
}

export const INITIAL_KDS_ORDERS: KdsOrder[] = [
  {
    id: "ord-101",
    orderNumber: "QD-8841",
    tableNumber: "04",
    customerName: "Alfin Faiz",
    customerPhone: "0812-9876-5432",
    guestCount: 2,
    orderedAt: "11:55 WIB",
    arrivalTime: "12:15 WIB",
    arrivalMinutesRemaining: -18,
    status: "ready",
    arrivalStatus: "tolerance_exceeded",
    lateMinutes: 18,
    totalAmount: 78000,
    paymentMethod: "QRIS",
    isCookAlarmTriggered: false,
    items: [
      {
        name: "Kopi Kenangan Mantan",
        qty: 2,
        variant: "Less Sugar (50%), Ice Normal",
        notes: "Gelas dipisah tutupnya",
      },
      {
        name: "Toast Coklat Klasik",
        qty: 1,
        variant: "Extra Cheese",
      },
    ],
  },
  {
    id: "ord-102",
    orderNumber: "QD-8842",
    tableNumber: "02",
    customerName: "Sarah Wijaya",
    customerPhone: "0813-1122-3344",
    guestCount: 4,
    orderedAt: "12:00 WIB",
    arrivalTime: "12:20 WIB",
    arrivalMinutesRemaining: -8,
    status: "ready",
    arrivalStatus: "late_grace",
    lateMinutes: 8,
    totalAmount: 145000,
    paymentMethod: "QRIS",
    isCookAlarmTriggered: false,
    items: [
      {
        name: "Avocado Coffee Float",
        qty: 2,
        variant: "Normal Sweet, Extra Espresso Shot",
      },
      {
        name: "Matcha Oat Latte",
        qty: 2,
        variant: "No Sugar, Oat Milk",
      },
      {
        name: "French Fries Bolognese",
        qty: 1,
        notes: "Saus bolognese dipisah di mangkok kecil",
      },
    ],
  },
  {
    id: "ord-103",
    orderNumber: "QD-8843",
    tableNumber: "07",
    customerName: "Dimas Pratama",
    customerPhone: "0877-5566-7788",
    guestCount: 2,
    orderedAt: "12:05 WIB",
    arrivalTime: "12:35 WIB",
    arrivalMinutesRemaining: 7,
    status: "cooking",
    arrivalStatus: "on_the_way",
    lateMinutes: 0,
    totalAmount: 92000,
    paymentMethod: "Virtual Account",
    isCookAlarmTriggered: true,
    items: [
      {
        name: "Caramel Macchiato",
        qty: 2,
        variant: "Hot, Less Sugar",
      },
      {
        name: "Croissant Almond",
        qty: 2,
        notes: "Tolong dihangatkan sebelum disajikan",
      },
    ],
  },
  {
    id: "ord-104",
    orderNumber: "QD-8844",
    tableNumber: "05",
    customerName: "Rizky Ramadhan",
    customerPhone: "0821-4455-6677",
    guestCount: 3,
    orderedAt: "12:12 WIB",
    arrivalTime: "12:40 WIB",
    arrivalMinutesRemaining: 12,
    status: "received",
    arrivalStatus: "on_the_way",
    lateMinutes: 0,
    totalAmount: 115000,
    paymentMethod: "QRIS",
    isCookAlarmTriggered: true,
    items: [
      {
        name: "Americano Double Shot",
        qty: 1,
        variant: "Iced, No Sugar",
      },
      {
        name: "Kopi Kenangan Mantan Large",
        qty: 2,
        variant: "Extra Grass Jelly, Normal Sugar",
      },
      {
        name: "Red Velvet Cake Slice",
        qty: 1,
      },
    ],
  },
  {
    id: "ord-105",
    orderNumber: "QD-8845",
    tableNumber: "09",
    customerName: "Clarissa Putri",
    customerPhone: "0856-7788-9900",
    guestCount: 2,
    orderedAt: "11:40 WIB",
    arrivalTime: "12:10 WIB",
    arrivalMinutesRemaining: 0,
    status: "ready",
    arrivalStatus: "arrived",
    lateMinutes: 0,
    totalAmount: 64000,
    paymentMethod: "QRIS",
    isCookAlarmTriggered: false,
    items: [
      {
        name: "Hazelnut Choco Milk",
        qty: 2,
        variant: "Less Ice, 70% Sugar",
      },
    ],
  },
];
