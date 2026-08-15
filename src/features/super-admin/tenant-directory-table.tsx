"use client";
// src/features/super-admin/tenant-directory-table.tsx
// Tabel Master Direktori Mitra Restoran untuk Super Admin

import { useState } from "react";
import {
  Search,
  Store,
  Phone,
  Landmark,
  Table2,
  CheckCircle2,
  AlertTriangle,
  Ban,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatRupiah } from "@/lib/utils";
import type { SuperAdminTenant, TenantStatus } from "@/features/super-admin/super-admin-data";

interface Props {
  tenants: SuperAdminTenant[];
  onToggleTenantStatus: (tenantId: string, nextStatus: TenantStatus) => void;
}

export function TenantDirectoryTable({ tenants, onToggleTenantStatus }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionTarget, setActionTarget] = useState<{
    tenant: SuperAdminTenant;
    nextStatus: TenantStatus;
  } | null>(null);

  const filtered = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmToggle = () => {
    if (!actionTarget) return;
    onToggleTenantStatus(actionTarget.tenant.id, actionTarget.nextStatus);
    setActionTarget(null);
  };

  return (
    <div className="rounded-2xl border border-[#bccac0]/30 bg-white overflow-hidden shadow-2xs space-y-4 p-5">
      {/* Top Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-[#131b2e]">
            Direktori Seluruh Mitra Restoran ({tenants.length})
          </h2>
          <p className="text-xs text-[#6d7a72]">
            Daftar restoran terintegrasi dengan QuickDine di seluruh Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#bccac0]/60 bg-white px-3 py-1.5 text-xs font-medium text-[#131b2e]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Mitra Aktif</option>
            <option value="suspended">Ditangguhkan</option>
          </select>

          {/* Search Input */}
          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6d7a72]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari restoran / pemilik..."
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
              <th className="py-3 px-4">Nama Restoran</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Pemilik &amp; Kontak</th>
              <th className="py-3 px-4 text-center">Meja</th>
              <th className="py-3 px-4 text-right">Volume GMV</th>
              <th className="py-3 px-4">Rekening Payout</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bccac0]/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[#6d7a72]">
                  Tidak ada restoran yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Resto Name & Address */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#131b2e] block">{tenant.name}</span>
                    <span className="text-[10px] text-[#6d7a72] line-clamp-1">
                      {tenant.address}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-block bg-slate-100 text-[#131b2e] font-semibold text-[10px] px-2 py-0.5 rounded-md">
                      {tenant.category}
                    </span>
                  </td>

                  {/* Owner & Phone */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#131b2e] block">
                      {tenant.ownerName}
                    </span>
                    <span className="text-[10px] text-[#6d7a72] font-mono">
                      {tenant.phone}
                    </span>
                  </td>

                  {/* Tables */}
                  <td className="py-3 px-4 text-center font-bold text-[#131b2e]">
                    {tenant.tableCount}
                  </td>

                  {/* Volume GMV */}
                  <td className="py-3 px-4 text-right font-extrabold text-[#006948]">
                    {formatRupiah(tenant.totalGmv)}
                  </td>

                  {/* Bank */}
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-[#131b2e] block">
                      {tenant.bankName}
                    </span>
                    <span className="text-[10px] text-[#6d7a72] font-mono truncate block max-w-44">
                      {tenant.bankAccount}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    {tenant.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        <Ban className="h-3 w-3" />
                        Ditangguhkan
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    {tenant.status === "active" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActionTarget({ tenant, nextStatus: "suspended" })
                        }
                        className="text-[10px] h-7 px-2 font-bold text-red-600 border-red-200 hover:bg-red-50"
                        title="Tangguhkan resto"
                      >
                        Bekukan
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          setActionTarget({ tenant, nextStatus: "active" })
                        }
                        className="text-[10px] h-7 px-2 font-bold bg-[#006948] hover:bg-[#005137] text-white"
                        title="Aktifkan kembali"
                      >
                        Aktifkan
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(actionTarget)}
        title={
          actionTarget?.nextStatus === "suspended"
            ? `Bekukan Kemitraan "${actionTarget?.tenant.name}"?`
            : `Aktifkan Kembali Kemitraan "${actionTarget?.tenant.name}"?`
        }
        description={
          actionTarget?.nextStatus === "suspended"
            ? "Restoran ini akan ditangguhkan sementara dari platform QuickDine sehingga tidak dapat menerima reservasi meja atau transaksi customer baru."
            : "Restoran ini akan diaktifkan kembali dan dapat langsung menerima reservasi meja secara normal."
        }
        confirmLabel={
          actionTarget?.nextStatus === "suspended"
            ? "Ya, Bekukan Kemitraan"
            : "Ya, Aktifkan Kembali"
        }
        variant={actionTarget?.nextStatus === "suspended" ? "danger" : "primary"}
        onConfirm={handleConfirmToggle}
        onClose={() => setActionTarget(null)}
      />
    </div>
  );
}
