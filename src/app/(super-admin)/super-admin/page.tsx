"use client";
// src/app/(super-admin)/super-admin/page.tsx
// Halaman Ringkasan KPI Eksekutif Super Admin (Clean, Non-Redundant)

import Link from "next/link";
import {
  UserCheck,
  Store,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuperAdminKPICards } from "@/features/super-admin/super-admin-kpi-cards";
import { INITIAL_SUPER_ADMIN_KPI } from "@/features/super-admin/super-admin-data";
import { formatRupiah } from "@/lib/utils";

export default function SuperAdminDashboardPage() {
  const kpi = INITIAL_SUPER_ADMIN_KPI;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
          Ringkasan KPI Platform QuickDine
        </h1>
        <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
          Pusat kendali eksekutif untuk memantau performa perputaran GMV nasional, profit fee, dan kesehatan ekosistem platform.
        </p>
      </div>

      {/* 4 Executive KPI Cards */}
      <SuperAdminKPICards kpi={kpi} />

      {/* Quick Action & Management Shortcuts (Clean segregation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shortcut 1: Verifikasi Mitra */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
                <UserCheck className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Perlu Tindakan
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              Verifikasi Mitra Pendaftar Baru
            </h3>
            <p className="text-xs text-[#6d7a72]">
              Terdapat <strong>{kpi.pendingVerifications} calon restoran</strong> yang mendaftar via formulir mandiri dan menunggu persetujuan.
            </p>
          </div>

          <Link href="/super-admin/verifikasi">
            <Button
              size="sm"
              className="w-full h-9 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs justify-between rounded-xl"
            >
              <span>Buka Antrean Verifikasi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Shortcut 2: Direktori Restoran */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white">
                <Store className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Operasional
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              Direktori Seluruh Mitra Restoran
            </h3>
            <p className="text-xs text-[#6d7a72]">
              Kelola status <strong>{kpi.totalActiveTenants} restoran aktif</strong>, kontrol pembekuan/pengaktifan mitra, dan unduh database Excel.
            </p>
          </div>

          <Link href="/super-admin/tenants">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 border-[#bccac0]/60 hover:bg-slate-50 text-[#131b2e] font-bold text-xs justify-between rounded-xl"
            >
              <span>Buka Direktori Mitra</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Shortcut 3: Transaksi & Keuangan */}
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Receipt className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Keuangan
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              Log Transaksi &amp; Payout Nasional
            </h3>
            <p className="text-xs text-[#6d7a72]">
              Pantau <strong>{kpi.totalOrdersToday.toLocaleString("id-ID")} pesanan hari ini</strong>, potongan fee QRIS/VA, dan ekspor Master Ledger (.xlsx).
            </p>
          </div>

          <Link href="/super-admin/transaksi">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 border-[#bccac0]/60 hover:bg-slate-50 text-[#131b2e] font-bold text-xs justify-between rounded-xl"
            >
              <span>Buka Log Transaksi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Platform Infrastructure Health Status */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#006948]" />
            <h2 className="text-sm font-bold text-[#131b2e]">
              Status Sistem &amp; Integrasi Layanan Ekosistem
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Semua Sistem Normal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-[#6d7a72] font-semibold block">Midtrans Payment Webhook</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#131b2e]">Latency: 120ms</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-[#6d7a72] font-semibold block">Supabase Realtime &amp; Database</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#131b2e]">Uptime: 99.98%</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-[#6d7a72] font-semibold block">WhatsApp Notification Gateway</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#131b2e]">Status: Terhubung</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
