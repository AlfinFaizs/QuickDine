import { FonnteNotificationService } from "./fonnte.service";
import { INotificationService } from "./notification.interface";

let notificationServiceInstance: INotificationService | null = null;

export function getNotificationService(): INotificationService {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new FonnteNotificationService();
  }
  return notificationServiceInstance;
}

export * from "./notification.interface";
