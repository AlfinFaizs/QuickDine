// src/app/api/webhooks/telegram/route.ts
// Webhook receiver untuk merespon perintah Telegram Bot (/id, /status, /help, /start) secara cerdas

import { NextResponse, type NextRequest } from "next/server";
import { getTelegramNotificationService } from "@/services/notification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const message = body?.message || body?.channel_post;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message?.chat?.id;
    const rawText = (message?.text || "").trim().toLowerCase();
    const telegramService = getTelegramNotificationService();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://quick-dine-navy-seven.vercel.app";

    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    // 1. Perintah /id (Tap-to-Copy ID Grup & Tombol Buka Pengaturan)
    if (rawText === "/id" || rawText.startsWith("/id@")) {
      const isGroup =
        message?.chat?.type === "group" || message?.chat?.type === "supergroup";

      const replyText = [
        `<b>INFORMASI ID TELEGRAM RESTORAN</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Tipe Percakapan: <b>${isGroup ? "Grup Dapur Restoran" : "Chat Pribadi"}</b>`,
        `ID Telegram: <code>${chatId}</code>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<i>Sentuh angka ID di atas untuk menyalin, lalu tempelkan pada menu Pengaturan Restoran di QuickDine.</i>`,
      ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "Buka Pengaturan Restoran",
              url: `${appUrl}/dashboard/settings`,
            },
          ],
        ],
      };

      await telegramService.sendRawTelegramMessage(chatId, replyText, inlineKeyboard);
    }

    // 2. Perintah /status (Cek Kesehatan & Koneksi Server)
    else if (rawText === "/status" || rawText.startsWith("/status@")) {
      const replyText = [
        `<b>STATUS LAYANAN NOTIFIKASI QUICKDINE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Status Layanan: <b>Online & Normal</b>`,
        `Waktu Server: <b>${new Date().toLocaleTimeString("id-ID")} WIB</b>`,
        `Fungsi: <b>Notifikasi Pesanan & Alarm Dapur</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Sistem siap menerima pesanan masuk dan meneruskan struk ke grup ini secara real-time.`,
      ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "Buka Layar Dapur (KDS)", url: `${appUrl}/dashboard/kds` },
            { text: "Buka Denah Meja", url: `${appUrl}/dashboard/tables` },
          ],
        ],
      };

      await telegramService.sendRawTelegramMessage(chatId, replyText, inlineKeyboard);
    }

    // 3. Perintah /help atau /bantuan (Panduan Operasional)
    else if (
      rawText === "/help" ||
      rawText.startsWith("/help@") ||
      rawText === "/bantuan" ||
      rawText.startsWith("/bantuan@")
    ) {
      const replyText = [
        `<b>PANDUAN PERINTAH BOT QUICKDINE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Berikut daftar perintah yang dapat digunakan di grup ini:`,
        ``,
        `• <b>/id</b> — Menampilkan Chat ID grup untuk pengaturan resto`,
        `• <b>/status</b> — Memeriksa status kesehatan koneksi bot & server`,
        `• <b>/help</b> — Menampilkan panduan bantuan ini`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Pesanan lunas dari pelanggan akan otomatis dikirimkan ke grup ini beserta tombol aksi cepat ke dapur.`,
      ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "Buka Dashboard Restoran",
              url: `${appUrl}/dashboard/settings`,
            },
          ],
        ],
      };

      await telegramService.sendRawTelegramMessage(chatId, replyText, inlineKeyboard);
    }

    // 4. Perintah /start
    else if (rawText === "/start" || rawText.startsWith("/start@")) {
      const replyText = [
        `<b>QUICKDINE NOTIFICATION SERVICE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Bot ini bertugas meneruskan pesanan masuk, jadwal persiapan memasak, dan koordinasi staf dapur secara instan.`,
        ``,
        `Ketik <b>/id</b> di grup ini untuk mendapatkan Chat ID yang perlu dimasukkan ke dashboard restoran Anda.`,
      ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "Buka Pengaturan Restoran",
              url: `${appUrl}/dashboard/settings`,
            },
          ],
        ],
      };

      await telegramService.sendRawTelegramMessage(chatId, replyText, inlineKeyboard);
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[Telegram Webhook Receiver Error]:", error);
    return NextResponse.json({ ok: true });
  }
}
