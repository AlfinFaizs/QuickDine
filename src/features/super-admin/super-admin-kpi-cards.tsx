// src/features/super-admin/super-admin-kpi-cards.tsx
// Komponen bar 4 kartu KPI finansial & transaksi eksekutif platform Super Admin QuickDine

import { TrendingUp, ShoppingBag, DollarSign, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { SuperAdminKPI } from "@/features/super-admin/super-admin-data";

interface Props {
  kpi: SuperAdminKPI;
}

export function SuperAdminKPICards({ kpi }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total GMV Transaksi Nasional */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#131b2e]">
            <TrendingUp className="h-5 w-5 text-[#006948]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            +8.4% bln ini
          </span>
        </div>
        <div>
          <span className="text-xs text-[#6d7a72] font-semibold block">
            Total GMV Transaksi Platform
          </span>
          <span className="text-xl font-black text-[#131b2e]">
            {formatRupiah(kpi.totalGmv)}
          </span>
        </div>
      </div>

      {/* 2. Total Profit Fee QuickDine */}
      <div className="rounded-2xl border border-[#006948]/30 bg-emerald-50/40 p-5 space-y-3 shadow-2xs ring-1 ring-[#006948]/20">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-white">
            <DollarSign className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-[#006948] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            Pendapatan Fee
          </span>
        </div>
        <div>
          <span className="text-xs text-[#006948] font-bold block">
            Pendapatan Fee Platform
          </span>
          <span className="text-xl font-black text-[#006948]">
            {formatRupiah(kpi.totalFeeRevenue)}
          </span>
        </div>
      </div>

      {/* 3. Total Pesanan Hari Ini */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Hari Ini
          </span>
        </div>
        <div>
          <span className="text-xs text-[#6d7a72] font-semibold block">
            Volume Pesanan Hari Ini
          </span>
          <span className="text-xl font-black text-[#131b2e]">
            {kpi.totalOrdersToday.toLocaleString("id-ID")} Pesanan
          </span>
        </div>
      </div>

      {/* 4. Success Rate Transaksi */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#006948]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Stabil
          </span>
        </div>
        <div>
          <span className="text-xs text-[#6d7a72] font-semibold block">
            Tingkat Keberhasilan Pesanan
          </span>
          <span className="text-xl font-black text-[#131b2e]">
            {kpi.successRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
