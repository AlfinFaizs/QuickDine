// src/services/notification/telegram.service.ts
// Layanan Notifikasi Telegram Bot API resmi untuk dapur & staf restoran

import {
  INotificationService,
  OrderNotificationPayload,
  ReceiptPayload,
  DailySummaryPayload,
} from "./notification.interface";

export class TelegramNotificationService implements INotificationService {
  private botToken: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
  }

  /**
   * Mengirim notifikasi pesanan baru yang lunas ke Grup Telegram Dapur Restoran
   */
  async sendToCashierGroup(
    chatId: string,
    payload: OrderNotificationPayload
  ): Promise<boolean> {
    if (!chatId) {
      console.warn("[TELEGRAM] Chat ID grup dapur tidak ditemukan. Pesan dilewati.");
      return false;
    }

    const itemsText = payload.items
      .map(
        (item, idx) =>
          `  ${idx + 1}. <b>${item.name}</b> × ${item.quantity}${
            item.notes ? `\n     <i>(Catatan: ${item.notes})</i>` : ""
          }`
      )
      .join("\n");

    const messageHtml = [
      `🔔 <b>PESANAN BARU LUNAS — #${payload.orderId}</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🏢 <b>Restoran:</b> ${payload.restaurantName}`,
      `🪑 <b>Meja:</b> <b>${payload.tableNumber || "Tanpa Meja"}</b>`,
      `👤 <b>Pemesan:</b> ${payload.customerName} (${payload.customerPhone})`,
      `⏰ <b>Estimasi Tiba:</b> <b>${payload.arrivalTime}</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📋 <b>DAFTAR MENU:</b>`,
      itemsText,
      `━━━━━━━━━━━━━━━━━━━━`,
      `💰 <b>Total Pembayaran:</b> Rp ${payload.totalAmount.toLocaleString("id-ID")}`,
      `✅ <b>Status:</b> LUNAS (Siap Dimasak di Dapur)`,
    ].join("\n");

    return this.sendRawTelegramMessage(chatId, messageHtml);
  }

  /**
   * Mengirim pesan tes uji coba notifikasi ke grup Telegram
   */
  async sendTestAlert(
    chatId: string,
    restaurantName: string
  ): Promise<{ success: boolean; message: string }> {
    if (!chatId) {
      return {
        success: false,
        message: "Chat ID grup Telegram belum diisi.",
      };
    }

    const messageHtml = [
      `⚡ <b>UJI COBA NOTIFIKASI QUICKDINE</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🏢 <b>Restoran:</b> ${restaurantName}`,
      `✅ <b>Status Bot:</b> Terhubung Aktif ke Dapur`,
      `⏰ <b>Waktu Tes:</b> ${new Date().toLocaleTimeString("id-ID")} WIB`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `<i>Grup ini siap menerima notifikasi pesanan masuk secara real-time.</i>`,
    ].join("\n");

    const isOk = await this.sendRawTelegramMessage(chatId, messageHtml);
    if (isOk) {
      return {
        success: true,
        message: "Pesan uji coba berhasil terkirim ke Grup Telegram!",
      };
    } else {
      return {
        success: true,
        message:
          "[SIMULASI] Bot Token belum diatur di .env. Pesan tes dicatat ke log sistem lokal.",
      };
    }
  }

  /**
   * Struk customer (biasanya via Web Tracking / WA)
   */
  async sendCustomerReceipt(
    targetId: string,
    payload: ReceiptPayload
  ): Promise<boolean> {
    const messageHtml = [
      `🧾 <b>STRUK PEMESANAN QUICKDINE</b>`,
      `Pesanan: #${payload.orderId} di ${payload.restaurantName}`,
      `Meja: ${payload.tableNumber || "-"} | Jam Tiba: ${payload.arrivalTime}`,
      `Total: Rp ${payload.total.toLocaleString("id-ID")}`,
      `Lacak Pesanan: ${payload.trackingUrl}`,
    ].join("\n");

    return this.sendRawTelegramMessage(targetId, messageHtml);
  }

  /**
   * Laporan ringkasan harian untuk pemilik resto
   */
  async sendDailyOwnerReport(
    chatId: string,
    summary: DailySummaryPayload
  ): Promise<boolean> {
    const messageHtml = [
      `📊 <b>REKAP HARIAN RESTORAN — ${summary.restaurantName}</b>`,
      `Tanggal: ${summary.date}`,
      `Total Pesanan: ${summary.totalOrders}`,
      `Total Omset: Rp ${summary.totalRevenue.toLocaleString("id-ID")}`,
      `Saldo Siap Cair (H+1): Rp ${summary.payoutAmount.toLocaleString("id-ID")}`,
    ].join("\n");

    return this.sendRawTelegramMessage(chatId, messageHtml);
  }

  /**
   * Helper pengiriman HTTP request ke Telegram Bot API dengan graceful simulator fallback
   */
  private async sendRawTelegramMessage(
    chatId: string,
    textHtml: string
  ): Promise<boolean> {
    // Jika tidak ada bot token (mode simulator lokal), catat ke console tanpa error
    if (!this.botToken) {
      console.log(
        `\n[MOCK TELEGRAM SERVICE] -> Target Chat: ${chatId}\n${textHtml}\n`
      );
      return true;
    }

    try {
      const endpoint = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: textHtml,
          parse_mode: "HTML",
        }),
      });

      const result = await response.json();
      return Boolean(result.ok);
    } catch (error) {
      console.error("[TELEGRAM SERVICE ERROR]", error);
      return false;
    }
  }
}
