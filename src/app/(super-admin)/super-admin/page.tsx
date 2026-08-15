"use client";
// src/app/(super-admin)/super-admin/page.tsx
// Halaman Dashboard Utama Super Admin: Ringkasan KPI Platform & Log Transaksi Nasional

import { useState } from "react";
import { FileSpreadsheet, QrCode, CreditCard, CheckCircle2, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuperAdminKPICards } from "@/features/super-admin/super-admin-kpi-cards";
import {
  INITIAL_SUPER_ADMIN_KPI,
  INITIAL_GLOBAL_TRANSACTIONS,
  type SuperAdminGlobalTransaction,
} from "@/features/super-admin/super-admin-data";
import { exportFinanceToExcel } from "@/lib/excel-export";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function SuperAdminDashboardPage() {
  const [kpi] = useState(INITIAL_SUPER_ADMIN_KPI);
  const [transactions] = useState<SuperAdminGlobalTransaction[]>(INITIAL_GLOBAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(search.toLowerCase()) ||
      tx.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || tx.paymentMethod.includes(methodFilter);
    return matchesSearch && matchesMethod;
  });

  const handleExportMasterLedger = async () => {
    setIsExporting(true);
    try {
      await exportFinanceToExcel({
        restaurantName: "Konsolidasi Seluruh Mitra Platform",
        reportPeriod: "14 - 15 Agustus 2026",
        totalGross: kpi.totalGmv,
        totalFee: kpi.totalFeeRevenue,
        totalNet: kpi.totalGmv - kpi.totalFeeRevenue,
        transactions: transactions.map((t) => ({
          id: `${t.orderNumber} (${t.restaurantName})`,
          createdAt: t.createdAt,
          customerName: t.customerName,
          paymentMethod: t.paymentMethod,
          grossAmount: t.grossAmount,
          platformFee: t.platformFee,
          netAmount: t.netAmount,
          status: t.payoutStatus === "settled" ? "Sudah Cair" : "Menunggu H+1",
        })),
      });
      toast.success("File Master Ledger Excel (.xlsx) berhasil diunduh.", {
        id: "export-master-ledger-toast",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunduh Excel.";
      toast.error(msg, { id: "export-master-ledger-toast" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
            Ringkasan KPI &amp; Performa Platform
          </h1>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
            Pusat kendali eksekutif untuk memantau volume GMV transaksi, profit fee platform, dan stabilitas pembayaran.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleExportMasterLedger}
          isLoading={isExporting}
          className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 px-4 gap-1.5 shrink-0 shadow-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export Master Ledger (.xlsx)</span>
        </Button>
      </div>

      {/* 4 Executive KPI Cards */}
      <SuperAdminKPICards kpi={kpi} />

      {/* Global Transactions Log Table */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white overflow-hidden shadow-2xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#131b2e]">
              Log Transaksi Pesanan Nasional Real-Time
            </h2>
            <p className="text-xs text-[#6d7a72]">
              Arus transaksi masuk dari seluruh restoran mitra di Indonesia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-[#bccac0]/60 bg-white px-3 py-1.5 text-xs font-medium text-[#131b2e]"
            >
              <option value="all">Semua Pembayaran</option>
              <option value="QRIS">QRIS</option>
              <option value="VA">Virtual Account</option>
            </select>

            <div className="relative w-48 sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6d7a72]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari resto / pesanan..."
                className="pl-8 text-xs h-9 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#bccac0]/30">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#faf8ff] border-b border-[#bccac0]/30 text-[#6d7a72] uppercase font-bold text-[10px]">
                <th className="py-3 px-4">No. Pesanan</th>
                <th className="py-3 px-4">Nama Restoran</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4 text-right">Gross GMV</th>
                <th className="py-3 px-4 text-right">Fee Platform</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#6d7a72]">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#006948]">
                      #{tx.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#131b2e]">
                      {tx.restaurantName}
                    </td>
                    <td className="py-3 px-4 text-[#6d7a72] whitespace-nowrap">
                      {tx.createdAt}
                    </td>
                    <td className="py-3 px-4 text-[#131b2e]">
                      {tx.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          tx.paymentMethod === "QRIS"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                        }`}
                      >
                        {tx.paymentMethod === "QRIS" ? (
                          <QrCode className="h-3 w-3" />
                        ) : (
                          <CreditCard className="h-3 w-3" />
                        )}
                        <span>{tx.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#131b2e]">
                      {formatRupiah(tx.grossAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#006948]">
                      +{formatRupiah(tx.platformFee)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.payoutStatus === "settled" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Settled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="h-3 w-3" />
                          Menunggu H+1
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
