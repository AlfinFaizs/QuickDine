import {
  DailySummaryPayload,
  INotificationService,
  OrderNotificationPayload,
  ReceiptPayload,
} from "./notification.interface";
import { formatRupiah } from "@/lib/utils";

export class FonnteNotificationService implements INotificationService {
  private token: string;
  private baseUrl = "https://api.fonnte.com/send";

  constructor(token?: string) {
    this.token = token || process.env.FONNTE_TOKEN || "";
  }

  private async send(target: string, message: string): Promise<boolean> {
    if (!this.token) {
      console.warn("[FonnteNotificationService] Token not configured. Message skipped:", target);
      return false;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target,
          message,
          countryCode: "62",
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("[FonnteNotificationService] Send failed:", error);
      return false;
    }
  }

  async sendToCashierGroup(groupId: string, payload: OrderNotificationPayload): Promise<boolean> {
    const itemList = payload.items
      .map((item) => `- ${item.quantity}x ${item.name}${item.notes ? ` (${item.notes})` : ""}`)
      .join("\n");

    const message = `🔔 *PESANAN BARU TERBAYAR*\nResto: *${payload.restaurantName}*\nMeja: *${payload.tableNumber || "Tanpa Meja"}*\nPelanggan: ${payload.customerName} (${payload.customerPhone})\nJam Tiba: ${payload.arrivalTime}\n\n*Item Pesanan:*\n${itemList}\n\n*Total: ${formatRupiah(payload.totalAmount)}*\n_Silakan proses persiapan di KDS._`;

    return this.send(groupId, message);
  }

  async sendCustomerReceipt(phone: string, payload: ReceiptPayload): Promise<boolean> {
    const itemList = payload.items
      .map((item) => `- ${item.quantity}x ${item.name} (${formatRupiah(item.price)})`)
      .join("\n");

    const message = `🧾 *STRUK PEMESANAN QUICKDINE*\nTerima kasih, *${payload.customerName}*!\n\nRestoran: *${payload.restaurantName}*\nMeja: *${payload.tableNumber || "-"}*\nEstimasi Tiba: *${payload.arrivalTime}*\n\n*Rincian Menu:*\n${itemList}\nSubtotal: ${formatRupiah(payload.subtotal)}\nBiaya Layanan: ${formatRupiah(payload.platformFee)}\n*Total Bayar: ${formatRupiah(payload.total)}*\n\n📍 *Pantau Status Masak Real-Time:*\n${payload.trackingUrl}\n\n_Harap tiba tepat waktu. Makanan mulai dimasak sebelum jam kedatangan Anda._`;

    return this.send(phone, message);
  }

  async sendDailyOwnerReport(ownerPhone: string, summary: DailySummaryPayload): Promise<boolean> {
    const message = `📊 *REKAP HARIAN OMSET RESTO*\nTanggal: ${summary.date}\nRestoran: *${summary.restaurantName}*\n\nTotal Pesanan Selesai: *${summary.totalOrders} order*\nTotal Omset Kotor: *${formatRupiah(summary.totalRevenue)}*\nEstimasi Payout Bersih: *${formatRupiah(summary.payoutAmount)}*\n\n_Rekap detail & ekspor CSV dapat diakses di dashboard keuangan QuickDine._`;

    return this.send(ownerPhone, message);
  }
}
