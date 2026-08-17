// src/app/api/webhooks/telegram/route.ts
// Webhook receiver untuk merespon perintah Telegram Bot (seperti /id atau /start) secara otomatis

import { NextResponse, type NextRequest } from "next/server";
import { getTelegramNotificationService } from "@/services/notification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Pastikan ada objek message
    const message = body?.message || body?.channel_post;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message?.chat?.id;
    const text = (message?.text || "").trim();

    // 1. Respon perintah /id untuk mengetahui ID grup secara mandiri
    if (text === "/id" || text.startsWith("/id@")) {
      const isGroup = message?.chat?.type === "group" || message?.chat?.type === "supergroup";
      const replyText = [
        `🤖 <b>INFORMASI ID TELEGRAM QUICKDINE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📍 <b>Tipe:</b> ${isGroup ? "Grup Dapur Restoran" : "Chat Pribadi"}`,
        `🆔 <b>ID Anda:</b> <code>${chatId}</code>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<i>Salin angka ID di atas dan tempelkan ke menu <b>Pengaturan Resto (Dashboard)</b> di website QuickDine.</i>`,
      ].join("\n");

      // Kirim balasan menggunakan bot token
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken && chatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            parse_mode: "HTML",
          }),
        });
      }
    }

    // 2. Respon perintah /start
    if (text === "/start" || text.startsWith("/start@")) {
      const replyText = [
        `👋 <b>Halo! Saya adalah Bot Resmi Notifikasi QuickDine.</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Saya bertugas mengirimkan notifikasi pesanan masuk, alarm persiapan memasak di dapur, dan rincian transaksi restoran secara real-time.`,
        ``,
        `Ketik <b>/id</b> di grup dapur ini untuk melihat Chat ID yang perlu Anda masukkan ke dashboard.`,
      ].join("\n");

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken && chatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            parse_mode: "HTML",
          }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[Telegram Webhook Receiver Error]:", error);
    return NextResponse.json({ ok: true });
  }
}
