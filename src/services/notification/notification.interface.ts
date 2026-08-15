export interface OrderNotificationPayload {
  orderId: string;
  restaurantName: string;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  arrivalTime: string;
  items: Array<{ name: string; quantity: number; notes?: string }>;
  totalAmount: number;
}

export interface ReceiptPayload {
  orderId: string;
  restaurantName: string;
  tableNumber?: string;
  customerName: string;
  arrivalTime: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  platformFee: number;
  total: number;
  trackingUrl: string;
}

export interface DailySummaryPayload {
  date: string;
  restaurantName: string;
  totalOrders: number;
  totalRevenue: number;
  payoutAmount: number;
}

export interface INotificationService {
  sendToCashierGroup(groupId: string, payload: OrderNotificationPayload): Promise<boolean>;
  sendCustomerReceipt(phone: string, payload: ReceiptPayload): Promise<boolean>;
  sendDailyOwnerReport(ownerPhone: string, summary: DailySummaryPayload): Promise<boolean>;
}
