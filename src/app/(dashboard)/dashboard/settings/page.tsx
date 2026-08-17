"use client";
// src/app/(dashboard)/dashboard/settings/page.tsx
// Halaman Pengaturan Operasional Restoran, Integrasi Telegram Dapur, Jadwal Masak, dan Rekening Bank

import { useState } from "react";
import {
  Store,
  Clock,
  Landmark,
  Send,
  Save,
  CheckCircle2,
  Bell,
  MessageSquare,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testTelegramAlertAction } from "@/features/partner/notification-actions";
import { toast } from "sonner";

export default function RestaurantSettingsPage() {
  // Profil Resto
  const [restoName, setRestoName] = useState("Sate Khas Senayan Pakubuwono");
  const [address, setAddress] = useState("Jl. Pakubuwono VI No. 10, Kebayoran Baru, Jakarta Selatan");
  const [phone, setPhone] = useState("0812-3456-7890");
  const [openTime, setOpenTime] = useState("10:00");
  const [closeTime, setCloseTime] = useState("22:00");

  // Parameter Jadwal Masak Dapur
  const [cookTriggerMinutes, setCookTriggerMinutes] = useState(20);
  const [autoCookEnabled, setAutoCookEnabled] = useState(true);

  // Rekening Payout Bank
  const [bankName, setBankName] = useState("BCA");
  const [bankAccount, setBankAccount] = useState("8820-1928-33");
  const [accountHolder, setAccountHolder] = useState("PT Rasa Kuliner Nusantara");

  // Notifikasi Telegram & WhatsApp Dapur
  const [telegramChatId, setTelegramChatId] = useState("-100234567890");
  const [waGroupNumber, setWaGroupNumber] = useState("0812-3456-7890");
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTestTelegram = async () => {
    if (!telegramChatId || telegramChatId.trim() === "") {
      toast.error("Silakan masukkan ID Grup Telegram terlebih dahulu.", {
        id: "test-telegram-toast",
      });
      return;
    }

    setIsTestingTelegram(true);
    try {
      const res = await testTelegramAlertAction(telegramChatId, restoName);
      if (res.success) {
        toast.success(res.message, { id: "test-telegram-toast" });
      } else {
        toast.error(res.message, { id: "test-telegram-toast" });
      }
    } catch {
      toast.error("Gagal mengirim tes Telegram.", { id: "test-telegram-toast" });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Pengaturan restoran berhasil disimpan.", {
        id: "save-settings-toast",
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
          Pengaturan Operasional &amp; Dapur
        </h1>
        <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
          Konfigurasi jadwal persiapan masak dapur, integrasi bot notifikasi Telegram, profil resto, dan rekening pencairan.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* SECTION 1: Profil Restoran */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-[#bccac0]/20 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006948] text-white">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Profil &amp; Jam Operasional</h2>
              <p className="text-[11px] text-[#6d7a72]">Informasi dasar restoran yang tampil pada halaman reservasi customer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#131b2e]">Nama Restoran</label>
              <Input
                value={restoName}
                onChange={(e) => setRestoName(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#131b2e]">Alamat Lengkap</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Nomor Telepon Restoran</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="text-xs h-10 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#131b2e]">Jam Buka</label>
                <Input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="text-xs h-10 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#131b2e]">Jam Tutup</label>
                <Input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="text-xs h-10 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Jadwal Mulai Masak Dapur */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-amber-200/50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Jadwal Mulai Memasak di Dapur</h2>
              <p className="text-[11px] text-[#6d7a72]">Tentukan berapa menit sebelum tamu tiba alarm KDS dapur mulai berdering.</p>
            </div>
          </div>

          <div className="space-y-3 bg-white p-4 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#131b2e]">
                Waktu Persiapan Masak: <span className="text-amber-800 text-sm font-extrabold">{cookTriggerMinutes} Menit Sebelum Tamu Tiba</span>
              </label>
              <span className="text-[11px] text-[#6d7a72]">Umumnya: 15–20 Menit</span>
            </div>

            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={cookTriggerMinutes}
              onChange={(e) => setCookTriggerMinutes(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-[#006948]"
            />

            <p className="text-[11px] text-[#6d7a72] leading-relaxed">
              * Contoh: Jika tamu memesan untuk jam tiba 12:30 dan Anda mengatur {cookTriggerMinutes} menit, maka layar dapur akan memberi alarm pengingat masak pada jam {12}:{30 - cookTriggerMinutes} agar hidangan selesai hangat saat tamu duduk.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-amber-200/40">
              <input
                type="checkbox"
                id="autoCookCheck"
                checked={autoCookEnabled}
                onChange={(e) => setAutoCookEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-[#006948]"
              />
              <label htmlFor="autoCookCheck" className="text-xs font-semibold text-[#131b2e]">
                Otomatis ubah status ke &quot;Sedang Dimasak&quot; saat jam masak tiba.
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Notifikasi Telegram Dapur (Resmi & Anti-Banned) */}
        <div className="rounded-2xl border border-[#006948]/30 bg-emerald-50/20 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#006948]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006948] text-white">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                  <span>Notifikasi Telegram Dapur &amp; Kasir</span>
                  <span className="text-[10px] font-extrabold bg-[#006948] text-white px-2 py-0.5 rounded-full">
                    Rekomendasi Resmi
                  </span>
                </h2>
                <p className="text-[11px] text-[#6d7a72]">
                  Notifikasi instan otomatis ke grup kru restoran Anda (100% gratis, bebas banned, dan tahan trafik tinggi).
                </p>
              </div>
            </div>
          </div>

          {/* 3 Step Setup Guide */}
          <div className="rounded-xl border border-[#006948]/20 bg-white p-3.5 space-y-2 text-xs text-[#131b2e]">
            <span className="font-bold text-[#006948] block text-[11px]">
              Panduan 3 Langkah Menghubungkan Telegram Dapur:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#6d7a72] leading-relaxed">
              <li>Buat <b>Grup Telegram</b> untuk staf koki &amp; kasir restoran Anda.</li>
              <li>Undang / tambahkan bot resmi platform <b>@QuickDineAlertBot</b> ke dalam grup tersebut.</li>
              <li>Salin <b>ID Grup Telegram</b> Anda (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#131b2e] font-mono">-100234567890</code>) ke kolom di bawah ini.</li>
            </ol>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">
              ID Grup Telegram Dapur Restoran (Chat ID)
            </label>
            <div className="flex gap-2">
              <Input
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Contoh: -100234567890"
                className="text-xs h-10 font-mono font-bold bg-white"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleTestTelegram}
                isLoading={isTestingTelegram}
                className="text-xs h-10 px-3.5 font-bold border-[#006948] text-[#006948] hover:bg-emerald-50 shrink-0 gap-1.5"
              >
                <Bell className="h-3.5 w-3.5" />
                <span>Kirim Tes Notifikasi</span>
              </Button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Rekening Payout H+1 */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-[#bccac0]/20 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Rekening Bank Pencairan Dana (Payout H+1)</h2>
              <p className="text-[11px] text-[#6d7a72]">Rekening bank tujuan transfer otomatis hasil penjualan bersih harian Anda.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Nama Bank</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-xl border border-[#bccac0]/60 bg-white px-3 py-2 text-xs font-medium text-[#131b2e]"
              >
                <option value="BCA">BCA (Bank Central Asia)</option>
                <option value="Mandiri">Bank Mandiri</option>
                <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                <option value="BNI">BNI (Bank Negara Indonesia)</option>
                <option value="CIMB">CIMB Niaga</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Nomor Rekening</label>
              <Input
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
                className="text-xs h-10 font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Nama Pemilik Rekening</label>
              <Input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            className="h-11 bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs px-6 gap-2 rounded-xl shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Semua Pengaturan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
