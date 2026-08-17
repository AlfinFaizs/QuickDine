// src/app/api/webhooks/telegram/route.ts
// Webhook receiver untuk merespon perintah Telegram Bot (/id, /status, /start) secara cerdas

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

    // 1. Perintah /id (Salin Instan ID Grup & Tombol Buka Pengaturan)
    if (rawText === "/id" || rawText.startsWith("/id@")) {
      const isGroup =
        message?.chat?.type === "group" || message?.chat?.type === "supergroup";

      const replyText = [
        `<b>ID TELEGRAM RESTORAN</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Tipe: <b>${isGroup ? "Grup Dapur Restoran" : "Chat Pribadi"}</b>`,
        `Chat ID: <code>${chatId}</code>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<i>Sentuh angka ID di atas untuk menyalin, lalu tempelkan ke menu Pengaturan Restoran di dashboard.</i>`,
      ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "Buka Pengaturan Resto",
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
        `<b>STATUS LAYANAN QUICKDINE BOT</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Koneksi: <b>Aktif & Normal</b>`,
        `Waktu Server: <b>${new Date().toLocaleTimeString("id-ID")} WIB</b>`,
        `Layanan: <b>Notifikasi Dapur & Kasir</b>`,
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

    // 3. Perintah /start (Panduan Informatif, Cara Hubungkan Bot, & Daftar Perintah)
    else if (rawText === "/start" || rawText.startsWith("/start@")) {
      const isGroup =
        message?.chat?.type === "group" || message?.chat?.type === "supergroup";

      const replyText = isGroup
        ? [
            `<b>BOT NOTIFIKASI RESTORAN QUICKDINE</b>`,
            `━━━━━━━━━━━━━━━━━━━━`,
            `Bot ini telah terhubung di grup dapur restoran Anda.`,
            ``,
            `<b>Perintah yang Tersedia:</b>`,
            `• <b>/id</b> — Menampilkan Chat ID grup untuk pengaturan dashboard`,
            `• <b>/status</b> — Memeriksa status kesehatan koneksi bot & server`,
            `━━━━━━━━━━━━━━━━━━━━`,
            `Setiap pesanan lunas akan otomatis diteruskan ke grup ini secara real-time.`,
          ].join("\n")
        : [
            `<b>QUICKDINE NOTIFICATION SERVICE</b>`,
            `━━━━━━━━━━━━━━━━━━━━`,
            `Layanan resmi bot pengantar notifikasi pesanan masuk, alarm persiapan memasak di dapur, dan rincian transaksi restoran.`,
            ``,
            `<b>Panduan Penggunaan:</b>`,
            `1. Tambahkan bot ini ke Grup Telegram staf/koki restoran Anda.`,
            `2. Ketik <b>/id</b> di dalam grup tersebut untuk mendapatkan Chat ID.`,
            `3. Masukkan Chat ID ke menu Pengaturan Restoran di website QuickDine.`,
            ``,
            `<b>Perintah yang Tersedia:</b>`,
            `• <b>/id</b> — Menampilkan Chat ID Anda / grup`,
            `• <b>/status</b> — Memeriksa status kesehatan koneksi server`,
            `━━━━━━━━━━━━━━━━━━━━`,
            `Setiap pesanan lunas akan otomatis diteruskan ke grup dapur secara real-time.`,
          ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "Buka Website QuickDine",
              url: appUrl,
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
