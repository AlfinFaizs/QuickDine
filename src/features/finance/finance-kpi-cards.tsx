// src/features/finance/finance-kpi-cards.tsx
// Komponen bar kartu metrik finansial restoran

import { Wallet, TrendingUp, Receipt, Clock, Landmark } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { FinanceKPISummary } from "@/features/finance/finance-data";

interface Props {
  summary: FinanceKPISummary;
}

export function FinanceKPICards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Omset Kotor */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#131b2e]">
            <TrendingUp className="h-5 w-5 text-[#006948]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6d7a72] bg-slate-100 px-2 py-0.5 rounded-full">
            Gross
          </span>
        </div>
        <div>
          <span className="text-xs text-[#6d7a72] font-semibold block">Total Omset Kotor</span>
          <span className="text-xl font-black text-[#131b2e]">
            {formatRupiah(summary.totalGross)}
          </span>
        </div>
      </div>

      {/* 2. Potongan Platform Fee */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
            Fee
          </span>
        </div>
        <div>
          <span className="text-xs text-amber-900 font-semibold block">Total Potongan Fee</span>
          <span className="text-xl font-black text-amber-950">
            {formatRupiah(summary.totalFee)}
          </span>
        </div>
      </div>

      {/* 3. Saldo Bersih Siap Cair */}
      <div className="rounded-2xl border border-[#006948]/30 bg-emerald-50/50 p-5 space-y-3 shadow-2xs ring-1 ring-[#006948]/20">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#006948] bg-emerald-100 px-2 py-0.5 rounded-full">
            Net Balance
          </span>
        </div>
        <div>
          <span className="text-xs text-[#006948] font-bold block">Saldo Bersih Siap Cair</span>
          <span className="text-xl font-black text-[#006948]">
            {formatRupiah(summary.totalNet)}
          </span>
        </div>
      </div>

      {/* 4. Status Payout H+1 */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Payout H+1
          </span>
        </div>
        <div>
          <span className="text-xs text-[#6d7a72] font-semibold block flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#006948]" />
            <span>Jadwal Transfer Otomatis</span>
          </span>
          <span className="text-sm font-extrabold text-[#131b2e] block leading-tight mt-0.5">
            {summary.payoutStatusDescription}
          </span>
          <span className="text-[10px] text-[#6d7a72] block truncate mt-1">
            {summary.payoutBankAccount}
          </span>
        </div>
      </div>
    </div>
  );
}
