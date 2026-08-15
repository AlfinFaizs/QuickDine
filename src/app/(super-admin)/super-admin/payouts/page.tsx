"use client";
// src/app/(super-admin)/super-admin/payouts/page.tsx
// Halaman Khusus Monitoring Pencairan Dana Omset Resto (Payout H+1) ke Seluruh Bank

import { useState } from "react";
import { FileSpreadsheet, Landmark, CheckCircle2, Clock, Search, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { exportFinanceToExcel } from "@/lib/excel-export";
import { toast } from "sonner";

interface PayoutSettlementItem {
  id: string;
  restaurantName: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  netPayoutAmount: number;
  ordersCount: number;
  scheduledDate: string;
  status: "completed" | "pending_clearing";
}

const MOCK_PAYOUTS: PayoutSettlementItem[] = [
  {
    id: "po-801",
    restaurantName: "Sate Khas Senayan Pakubuwono",
    bankName: "BCA",
    bankAccount: "8820-1928-33",
    accountHolder: "PT Rasa Kuliner Nusantara",
    netPayoutAmount: 14250000,
    ordersCount: 42,
    scheduledDate: "16 Agu 2026 (Pagi)",
    status: "pending_clearing",
  },
  {
    id: "po-802",
    restaurantName: "Pagi Sore Kemang",
    bankName: "Bank Mandiri",
    bankAccount: "124-00-889900-3",
    accountHolder: "PT Pagi Sore Nusantara",
    netPayoutAmount: 16500000,
    ordersCount: 38,
    scheduledDate: "16 Agu 2026 (Pagi)",
    status: "pending_clearing",
  },
  {
    id: "po-803",
    restaurantName: "Bakmi GM Grand Indonesia",
    bankName: "Bank Mandiri",
    bankAccount: "118-00-445566-2",
    accountHolder: "PT Griya Mie Bersama",
    netPayoutAmount: 11200000,
    ordersCount: 35,
    scheduledDate: "16 Agu 2026 (Pagi)",
    status: "pending_clearing",
  },
  {
    id: "po-804",
    restaurantName: "Holycow! Steakhouse Senopati",
    bankName: "BCA",
    bankAccount: "218-990-1122",
    accountHolder: "PT Holycow Meatlovers",
    netPayoutAmount: 9800000,
    ordersCount: 22,
    scheduledDate: "15 Agu 2026 (Selesai)",
    status: "completed",
  },
  {
    id: "po-805",
    restaurantName: "Kopi Kenangan Senopati",
    bankName: "BCA",
    bankAccount: "542-019-8833",
    accountHolder: "PT Bumi Berkah Boga",
    netPayoutAmount: 8940000,
    ordersCount: 65,
    scheduledDate: "15 Agu 2026 (Selesai)",
    status: "completed",
  },
  {
    id: "po-806",
    restaurantName: "Bebek Kaleyo Rawamangun",
    bankName: "BRI",
    bankAccount: "034-101-002233-50-1",
    accountHolder: "PT Kaleyo Kuliner Jaya",
    netPayoutAmount: 7800000,
    ordersCount: 28,
    scheduledDate: "15 Agu 2026 (Selesai)",
    status: "completed",
  },
];

export default function SuperAdminPayoutsPage() {
  const [payouts] = useState<PayoutSettlementItem[]>(MOCK_PAYOUTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const totalPending = payouts
    .filter((p) => p.status === "pending_clearing")
    .reduce((acc, p) => acc + p.netPayoutAmount, 0);

  const totalCompleted = payouts
    .filter((p) => p.status === "completed")
    .reduce((acc, p) => acc + p.netPayoutAmount, 0);

  const filtered = payouts.filter((p) => {
    const matchesSearch =
      p.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      p.bankName.toLowerCase().includes(search.toLowerCase()) ||
      p.bankAccount.includes(search);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportPayoutExcel = async () => {
    setIsExporting(true);
    try {
      await exportFinanceToExcel({
        restaurantName: "Jadwal Pencairan Payout Bank Nasional",
        reportPeriod: "15 - 16 Agustus 2026",
        totalGross: totalPending + totalCompleted,
        totalFee: 0,
        totalNet: totalPending + totalCompleted,
        transactions: payouts.map((p) => ({
          id: p.id,
          createdAt: p.scheduledDate,
          customerName: `${p.restaurantName} (${p.bankName} ${p.bankAccount})`,
          paymentMethod: p.bankName,
          grossAmount: p.netPayoutAmount,
          platformFee: 0,
          netAmount: p.netPayoutAmount,
          status: p.status === "completed" ? "Berhasil Ditransfer" : "Menunggu Kliring H+1",
        })),
      });

      toast.success("File Excel jadwal pencairan bank berhasil diunduh.", {
        id: "export-payouts-toast",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunduh Excel.";
      toast.error(msg, { id: "export-payouts-toast" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
            Monitoring Pencairan Dana (Payout Bank H+1)
          </h1>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
            Pengawasan jadwal transfer otomatis saldo bersih omset mitra ke rekening bank pemilik restoran di seluruh Indonesia.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleExportPayoutExcel}
          isLoading={isExporting}
          className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 px-4 gap-1.5 shrink-0 shadow-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export Rekap Payout (.xlsx)</span>
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              H+1 Besok Pagi
            </span>
          </div>
          <div>
            <span className="text-xs text-[#6d7a72] font-semibold block">Menunggu Transfer Kliring</span>
            <span className="text-xl font-black text-[#131b2e]">{formatRupiah(totalPending)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-[#006948] bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Sukses Ditransfer
            </span>
          </div>
          <div>
            <span className="text-xs text-[#6d7a72] font-semibold block">Berhasil Ditransfer Kemarin</span>
            <span className="text-xl font-black text-[#006948]">{formatRupiah(totalCompleted)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#131b2e]">
              <Landmark className="h-4 w-4 text-[#006948]" />
            </div>
            <span className="text-[10px] font-bold text-[#6d7a72] bg-slate-100 px-2.5 py-0.5 rounded-full">
              BCA, Mandiri, BRI
            </span>
          </div>
          <div>
            <span className="text-xs text-[#6d7a72] font-semibold block">Jalur Bank Terkoneksi</span>
            <span className="text-xl font-black text-[#131b2e]">4 Bank Nasional</span>
          </div>
        </div>
      </div>

      {/* Payout Settlements Table */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white overflow-hidden shadow-2xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#131b2e]">
              Daftar Batch Transfer Bank H+1
            </h2>
            <p className="text-xs text-[#6d7a72]">
              Rincian nominal omset yang siap dicairkan langsung ke rekening pemilik resto.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#bccac0]/60 bg-white px-3 py-1.5 text-xs font-medium text-[#131b2e]"
            >
              <option value="all">Semua Status</option>
              <option value="pending_clearing">Menunggu Transfer</option>
              <option value="completed">Sukses Ditransfer</option>
            </select>

            <div className="relative w-48 sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6d7a72]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari resto / rekening..."
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
                <th className="py-3 px-4">Nama Restoran</th>
                <th className="py-3 px-4">Rekening Tujuan</th>
                <th className="py-3 px-4 text-center">Jumlah Order</th>
                <th className="py-3 px-4 text-right">Nominal Payout Bersih</th>
                <th className="py-3 px-4">Jadwal Eksekusi</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#6d7a72]">
                    Tidak ada data pencairan yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#131b2e] block">{item.restaurantName}</span>
                      <span className="text-[10px] text-[#6d7a72]">ID Batch: {item.id}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                          {item.bankName}
                        </span>
                        <span className="font-mono text-xs text-[#131b2e]">{item.bankAccount}</span>
                      </div>
                      <span className="text-[10px] text-[#6d7a72] block mt-0.5">
                        a.n. {item.accountHolder}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-[#131b2e]">
                      {item.ordersCount} pesanan
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-[#006948]">
                      {formatRupiah(item.netPayoutAmount)}
                    </td>

                    <td className="py-3 px-4 text-[#6d7a72] whitespace-nowrap">
                      {item.scheduledDate}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Sukses
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
