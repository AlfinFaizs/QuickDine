"use client";
// src/app/(dashboard)/dashboard/finance/page.tsx
// Halaman Rekap Omset, Buku Kas Keuangan, & Ekspor Microsoft Excel (.xlsx)

import { useState } from "react";
import { FileSpreadsheet, Download, Landmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinanceKPICards } from "@/features/finance/finance-kpi-cards";
import { FinanceLedgerTable } from "@/features/finance/finance-ledger-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  INITIAL_TRANSACTIONS,
  INITIAL_FINANCE_SUMMARY,
  type FinanceTransaction,
} from "@/features/finance/finance-data";
import { exportFinanceToExcel } from "@/lib/excel-export";
import { toast } from "sonner";

export default function FinanceDashboardPage() {
  const [transactions] = useState<FinanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [summary] = useState(INITIAL_FINANCE_SUMMARY);
  const [isExporting, setIsExporting] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await exportFinanceToExcel({
        restaurantName: "Sate Khas Senayan",
        reportPeriod: "14 - 15 Agustus 2026",
        totalGross: summary.totalGross,
        totalFee: summary.totalFee,
        totalNet: summary.totalNet,
        transactions: transactions.map((t) => ({
          id: t.orderNumber,
          createdAt: t.createdAt,
          customerName: t.customerName,
          paymentMethod: t.paymentMethod,
          grossAmount: t.grossAmount,
          platformFee: t.platformFee,
          netAmount: t.netAmount,
          status: t.payoutStatus === "paid_out" ? "Sudah Cair" : "Menunggu H+1",
        })),
      });

      toast.success("File Microsoft Excel (.xlsx) rekap omset berhasil diunduh.", {
        id: "excel-export-toast",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunduh Excel.";
      toast.error(msg, { id: "excel-export-toast" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleManualPayoutRequest = () => {
    toast.success("Permintaan percepatan pencairan saldo diproses ke bank mitra.", {
      id: "payout-request-toast",
    });
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
            Laporan Keuangan &amp; Rekap Omset
          </h1>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
            Rekapitulasi pendapatan penjualan, potongan platform fee transparan, dan pencairan saldo H+1.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPayoutModalOpen(true)}
            className="text-xs h-10 px-3.5 font-bold text-[#131b2e] gap-1.5 border-[#bccac0]"
          >
            <Landmark className="h-4 w-4 text-[#006948]" />
            <span>Pencairan Cepat</span>
          </Button>

          {/* Export to Styled Excel */}
          <Button
            type="button"
            size="sm"
            onClick={handleExportExcel}
            isLoading={isExporting}
            className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 px-4 gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Rekap Excel (.xlsx)</span>
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <FinanceKPICards summary={summary} />

      {/* Ledger Table */}
      <FinanceLedgerTable transactions={transactions} />

      {/* Payout Acceleration Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isPayoutModalOpen}
        title="Ajukan Percepatan Pencairan Saldo?"
        description={`Saldo bersih sebesar Rp ${summary.totalNet.toLocaleString(
          "id-ID"
        )} akan ditransfer instan ke ${summary.payoutBankAccount}. Biaya transfer antar-bank berlaku sesuai ketentuan.`}
        confirmLabel="Ya, Cairkan Sekarang"
        variant="primary"
        onConfirm={handleManualPayoutRequest}
        onClose={() => setIsPayoutModalOpen(false)}
      />
    </div>
  );
}
