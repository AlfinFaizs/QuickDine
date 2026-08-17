"use server";
// src/features/partner/notification-actions.ts
// Server Action untuk pengujian notifikasi Telegram dan konfigurasi webhook

import { getTelegramNotificationService } from "@/services/notification";

export async function testTelegramAlertAction(
  chatId: string,
  restaurantName: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!chatId || chatId.trim() === "") {
      return {
        success: false,
        message: "Silakan masukkan ID Grup Telegram terlebih dahulu.",
      };
    }

    const telegramService = getTelegramNotificationService();
    return await telegramService.sendTestAlert(chatId.trim(), restaurantName);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan.";
    return {
      success: false,
      message: `Gagal mengirim tes notifikasi: ${msg}`,
    };
  }
}
