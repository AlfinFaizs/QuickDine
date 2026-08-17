// src/app/api/webhooks/telegram/route.ts
// Webhook receiver untuk merespon perintah Telegram Bot (/id, /status, /start) secara cerdas

import { NextResponse, type NextRequest } from "next/server";
import { getTelegramNotificationService } from "@/services/notification";
import { formatWIBTime } from "@/lib/utils";

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
        `Waktu Server: <b>${formatWIBTime()} WIB</b>`,
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

    // 3. Perintah /start (Panduan Lengkap, Cara Menghubungkan, & Daftar Perintah)
    else if (rawText === "/start" || rawText.startsWith("/start@")) {
      const isGroup =
        message?.chat?.type === "group" || message?.chat?.type === "supergroup";

      const replyText = [
        `<b>LAYANAN NOTIFIKASI RESTORAN QUICKDINE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Bot ini bertugas meneruskan pesanan masuk, alarm persiapan memasak di dapur, dan rincian transaksi restoran secara real-time.`,
        ``,
        `<b>Panduan Menghubungkan ke Restoran Anda:</b>`,
        `1. Di ${isGroup ? "grup ini" : "grup dapur Anda"}, ketik perintah <b>/id</b> untuk mendapatkan Chat ID.`,
        `2. Salin angka ID tersebut dan masukkan ke menu <b>Pengaturan Restoran</b> di dashboard web QuickDine.`,
        `3. Setelah tersimpan, seluruh pesanan lunas dari pelanggan akan otomatis masuk ke grup ini beserta tombol aksi cepat ke dapur.`,
        ``,
        `<b>Perintah yang Tersedia:</b>`,
        `• <b>/id</b> — Menampilkan Chat ID grup (format salin 1 sentuhan)`,
        `• <b>/status</b> — Memeriksa status kesehatan koneksi server dan bot`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<i>Ketik /id sekarang untuk melihat nomor ID ${isGroup ? "grup ini" : "Anda"}.</i>`,
      ].join("\n");

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "Buka Pengaturan Resto",
              url: `${appUrl}/dashboard/settings`,
            },
            {
              text: "Buka Layar Dapur (KDS)",
              url: `${appUrl}/dashboard/kds`,
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
