"use client";
// src/features/finance/finance-ledger-table.tsx
// Tabel Buku Kas Transaksi & Rekap Ledger Penjualan Restoran

import { useState } from "react";
import { Search, QrCode, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import type { FinanceTransaction, PaymentMethod } from "@/features/finance/finance-data";

interface Props {
  transactions: FinanceTransaction[];
}

export function FinanceLedgerTable({ transactions }: Props) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || tx.paymentMethod.includes(methodFilter);
    return matchesSearch && matchesMethod;
  });

  const totalGrossFiltered = filtered.reduce((acc, t) => acc + t.grossAmount, 0);
  const totalFeeFiltered = filtered.reduce((acc, t) => acc + t.platformFee, 0);
  const totalNetFiltered = filtered.reduce((acc, t) => acc + t.netAmount, 0);

  return (
    <div className="rounded-2xl border border-[#bccac0]/30 bg-white overflow-hidden shadow-2xs space-y-4 p-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-[#131b2e]">
            Buku Kas Transaksi Pesanan
          </h2>
          <p className="text-xs text-[#6d7a72]">
            Rincian log pembayaran pelanggan dan potongan biaya transaksi platform fee.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-[#bccac0]/60 bg-white px-3 py-1.5 text-xs font-medium text-[#131b2e]"
          >
            <option value="all">Semua Pembayaran</option>
            <option value="QRIS">QRIS</option>
            <option value="VA">Virtual Account</option>
          </select>

          {/* Search Input */}
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6d7a72]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pesanan..."
              className="pl-8 text-xs h-9 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#bccac0]/30">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#faf8ff] border-b border-[#bccac0]/30 text-[#6d7a72] uppercase font-bold text-[10px]">
              <th className="py-3 px-4">No. Pesanan</th>
              <th className="py-3 px-4">Waktu</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Metode Pembayaran</th>
              <th className="py-3 px-4 text-right">Omset Kotor</th>
              <th className="py-3 px-4 text-right">Platform Fee</th>
              <th className="py-3 px-4 text-right">Saldo Bersih</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bccac0]/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[#6d7a72]">
                  Tidak ada transaksi yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#006948]">
                    #{tx.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-[#6d7a72] whitespace-nowrap">
                    {tx.createdAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#131b2e] block">{tx.customerName}</span>
                    <span className="text-[10px] text-[#6d7a72]">{tx.customerPhone}</span>
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
                  <td className="py-3 px-4 text-right font-semibold text-[#131b2e]">
                    {formatRupiah(tx.grossAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-red-600">
                    -{formatRupiah(tx.platformFee)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#006948]">
                    {formatRupiah(tx.netAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tx.payoutStatus === "paid_out" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Cair
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
          {/* Summary Table Footer */}
          <tfoot>
            <tr className="bg-[#faf8ff] border-t-2 border-[#006948]/30 font-bold text-xs">
              <td colSpan={4} className="py-3 px-4 text-[#131b2e] font-extrabold uppercase">
                Total Ringkasan ({filtered.length} Transaksi)
              </td>
              <td className="py-3 px-4 text-right font-extrabold text-[#131b2e]">
                {formatRupiah(totalGrossFiltered)}
              </td>
              <td className="py-3 px-4 text-right font-bold text-red-600">
                -{formatRupiah(totalFeeFiltered)}
              </td>
              <td className="py-3 px-4 text-right font-black text-[#006948] text-sm">
                {formatRupiah(totalNetFiltered)}
              </td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
