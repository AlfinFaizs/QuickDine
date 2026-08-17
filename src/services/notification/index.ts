// src/services/notification/index.ts
// Factory dan export tunggal layanan notifikasi QuickDine

import { TelegramNotificationService } from "./telegram.service";
import { FonnteNotificationService } from "./fonnte.service";
import { INotificationService } from "./notification.interface";

let telegramServiceInstance: TelegramNotificationService | null = null;
let fonnteServiceInstance: FonnteNotificationService | null = null;

/**
 * Mengambil instance layanan notifikasi Telegram (default untuk dapur & staf resto)
 */
export function getTelegramNotificationService(): TelegramNotificationService {
  if (!telegramServiceInstance) {
    telegramServiceInstance = new TelegramNotificationService();
  }
  return telegramServiceInstance;
}

/**
 * Mengambil instance layanan WhatsApp (opsional)
 */
export function getWhatsAppNotificationService(): INotificationService {
  if (!fonnteServiceInstance) {
    fonnteServiceInstance = new FonnteNotificationService();
  }
  return fonnteServiceInstance;
}

export * from "./notification.interface";
export * from "./telegram.service";
export * from "./fonnte.service";
