"use client";

import { useState } from "react";
import { Settings, Save, Clock, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RestoSettingsPage() {
  const [restoName, setRestoName] = useState("Kopi Kenangan Senopati");
  const [phoneWa, setPhoneWa] = useState("081298765432");
  const [waGroupId, setWaGroupId] = useState("12036302482910@g.us");
  const [cookTriggerMinutes, setCookTriggerMinutes] = useState(15);
  const [bankAccount, setBankAccount] = useState("BCA - 1234567890 (PT Kenangan Kuliner)");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan profil resto berhasil disimpan.");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#006948]" />
          <span>Profil & Operasional Resto</span>
        </h1>
        <p className="text-xs text-[#6d7a72]">
          Konfigurasi trigger masak KDS, nomor WhatsApp notifikasi, dan rekening payout.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 shadow-2xs space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#131b2e]">Nama Restoran</label>
          <Input value={restoName} onChange={(e) => setRestoName(e.target.value)} required />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#131b2e]">Nomor WhatsApp Owner</label>
          <Input value={phoneWa} onChange={(e) => setPhoneWa(e.target.value)} required />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#131b2e]">ID Grup WhatsApp Kasir / Dapur (Fonnte)</label>
          <Input value={waGroupId} onChange={(e) => setWaGroupId(e.target.value)} />
          <p className="text-[10px] text-[#6d7a72] mt-1">Notifikasi pesanan baru otomatis dikirim ke grup ini</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#131b2e]">Trigger Mulai Masak (Menit Sebelum Jam Tiba)</label>
          <Input
            type="number"
            value={cookTriggerMinutes}
            onChange={(e) => setCookTriggerMinutes(Number(e.target.value))}
            min={5}
            max={60}
            required
          />
          <p className="text-[10px] text-[#006948] mt-1">Default: 15 menit sebelum kedatangan customer</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#131b2e]">Rekening Bank Payout</label>
          <Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} required />
        </div>

        <div className="pt-2">
          <Button type="submit" className="bg-[#006948] hover:bg-[#005137] text-white text-xs h-10 gap-1.5">
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
