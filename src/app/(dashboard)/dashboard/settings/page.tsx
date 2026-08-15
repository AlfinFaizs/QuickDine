"use client";
// src/app/(dashboard)/dashboard/settings/page.tsx
// Halaman Pengaturan Profil Resto, Jam Operasional, Rekening Payout, & Parameter Waktu Masak

import { useState } from "react";
import { Store, Clock, Landmark, MessageSquare, Save, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DashboardSettingsPage() {
  // Profile state
  const [restoName, setRestoName] = useState("Sate Khas Senayan");
  const [phone, setPhone] = useState("0812-3456-7890");
  const [address, setAddress] = useState("Jl. Pakubuwono VI No. 10, Kebayoran Baru, Jakarta Selatan");
  const [openTime, setOpenTime] = useState("10:00");
  const [closeTime, setCloseTime] = useState("22:00");

  // Operational KDS Cook Trigger
  const [cookTriggerMinutes, setCookTriggerMinutes] = useState(15);
  const [autoCookEnabled, setAutoCookEnabled] = useState(false);

  // Payout Bank state
  const [bankName, setBankName] = useState("BCA");
  const [bankAccount, setBankAccount] = useState("8820-1928-33");
  const [accountHolder, setAccountHolder] = useState("PT Rasa Kuliner Nusantara");

  // WhatsApp Fonnte State
  const [waGroupNumber, setWaGroupNumber] = useState("6281234567890");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Seluruh pengaturan resto & parameter operasional berhasil disimpan.", {
        id: "settings-save",
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
          Pengaturan Restoran &amp; Operasional
        </h1>
        <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
          Konfigurasi profil restoran, jam buka-tutup, parameter alarm masak dapur, dan rekening payout.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Profil & Kontak */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-[#bccac0]/20 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006948] text-white">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Profil &amp; Kontak Restoran</h2>
              <p className="text-[11px] text-[#6d7a72]">Informasi publik yang ditampilkan pada halaman katalog dan struk pesanan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Nama Restoran</label>
              <Input
                value={restoName}
                onChange={(e) => setRestoName(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Nomor Telepon / WhatsApp</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Alamat Lengkap</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="text-xs h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Jam Buka</label>
              <Input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="text-xs h-10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Jam Tutup</label>
              <Input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="text-xs h-10"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Parameter Waktu Masak KDS */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-amber-200/60 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fea619] text-[#2a1700]">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Parameter Waktu Masak Dapur (T-Cook)</h2>
              <p className="text-[11px] text-[#6d7a72]">
                Menentukan berapa menit sebelum estimasi kedatangan tamu (ETA) alarm KDS berbunyi agar koki menyalakan kompor.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#131b2e]">
                Waktu Persiapan Masak Standar: <span className="text-amber-800 text-sm font-extrabold">{cookTriggerMinutes} Menit</span>
              </label>
              <span className="text-[11px] text-[#6d7a72]">Rekomendasi: 15–20 Menit</span>
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
              * Contoh: Jika tamu memilih jam tiba 12:30 dan parameter diatur {cookTriggerMinutes} menit, maka tiket pesanan di KDS akan memicu alarm pada jam {12}:{30 - cookTriggerMinutes} agar makanan matang tepat waktu.
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
                Otomatis ubah status ke &quot;Sedang Dimasak&quot; saat waktu T-Cook tiba (tanpa klik manual).
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Rekening Payout H+1 */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-[#bccac0]/20 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Rekening Bank Pencairan Dana (Payout H+1)</h2>
              <p className="text-[11px] text-[#6d7a72]">Rekening tujuan transfer otomatis hasil penjualan bersih harian.</p>
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
              <label className="text-xs font-bold text-[#131b2e]">Atas Nama Rekening</label>
              <Input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
                className="text-xs h-10"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: WhatsApp Notifikasi Gateway */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-[#bccac0]/20 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Notifikasi WhatsApp Dapur (Fonnte API)</h2>
              <p className="text-[11px] text-[#6d7a72]">Nomor bot / grup WhatsApp untuk menerima alarm pesanan masuk dan peringatan no-show.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Nomor WA / Group ID Dapur</label>
            <Input
              value={waGroupNumber}
              onChange={(e) => setWaGroupNumber(e.target.value)}
              placeholder="6281234567890"
              className="text-xs h-10 font-mono"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-11 px-8 gap-2 shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Seluruh Pengaturan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
