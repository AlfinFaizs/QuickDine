"use client";

import { DollarSign, Download, TrendingUp, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function FinancePage() {
  const handleExportCsv = () => {
    toast.success("File CSV rekap payout H+1 berhasil diunduh.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-[#006948]" />
            <span>Laporan Keuangan & Saldo</span>
          </h1>
          <p className="text-xs text-[#6d7a72]">
            Rekap omset harian, ledger saldo, dan ekspor CSV untuk pencairan payout manual H+1.
          </p>
        </div>
        <Button onClick={handleExportCsv} className="bg-[#006948] hover:bg-[#005137] text-white text-xs h-9 gap-1.5">
          <Download className="h-4 w-4" />
          <span>Ekspor CSV Payout H+1</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 shadow-2xs space-y-2">
          <span className="text-xs text-[#6d7a72]">Total Saldo Siap Payout</span>
          <p className="text-2xl font-black text-[#006948]">{formatRupiah(2450000)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">100% utuh tanpa potongan komisi makanan</span>
        </div>

        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 shadow-2xs space-y-2">
          <span className="text-xs text-[#6d7a72]">Omset Kotor Hari Ini</span>
          <p className="text-2xl font-black text-[#131b2e]">{formatRupiah(890000)}</p>
          <span className="text-[11px] text-[#6d7a72]">Dari 28 pesanan selesai</span>
        </div>

        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 shadow-2xs space-y-2">
          <span className="text-xs text-[#6d7a72]">Status Langganan SaaS</span>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-emerald-700">Aktif</p>
            <span className="text-xs text-[#6d7a72]">• Rp 200.000 / bln</span>
          </div>
          <span className="text-[11px] text-[#6d7a72]">Berlaku s/d 28 Feb 2026</span>
        </div>
      </div>
    </div>
  );
}
