"use client";

import Link from "next/link";
import { ShieldCheck, Users, DollarSign, Store, ArrowLeft } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function SuperAdminPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] p-6 lg:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#6d7a72] hover:text-[#006948] mb-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-2xl font-black text-[#131b2e] flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-[#006948]" />
            <span>Super Admin Platform QuickDine</span>
          </h1>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 shadow-2xs space-y-1">
          <span className="text-xs text-[#6d7a72]">Total GMV Transaksi Platform</span>
          <p className="text-3xl font-black text-[#006948]">{formatRupiah(48500000)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Bulan Berjalan</span>
        </div>

        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 shadow-2xs space-y-1">
          <span className="text-xs text-[#6d7a72]">Total Net Laba Platform Fee</span>
          <p className="text-3xl font-black text-[#fea619]">{formatRupiah(3850000)}</p>
          <span className="text-[11px] text-[#6d7a72]">Dari Rp1.500 QRIS & Rp5.500 VA</span>
        </div>

        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 shadow-2xs space-y-1">
          <span className="text-xs text-[#6d7a72]">Total Resto Terdaftar</span>
          <p className="text-3xl font-black text-[#131b2e]">24 Mitra</p>
          <span className="text-[11px] text-emerald-700 font-medium">21 Langganan Aktif</span>
        </div>
      </div>
    </div>
  );
}
