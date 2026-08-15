"use client";
// src/app/(super-admin)/super-admin/tenants/page.tsx
// Halaman Khusus Direktori Mitra Restoran Terdaftar & Kontrol Status Kemitraan

import { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Store, CheckCircle2, Ban, Table2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TenantDirectoryTable } from "@/features/super-admin/tenant-directory-table";
import {
  INITIAL_SUPER_ADMIN_TENANTS,
  type SuperAdminTenant,
  type TenantStatus,
} from "@/features/super-admin/super-admin-data";
import { exportSuperAdminTenantsToExcel } from "@/lib/excel-export";
import { toast } from "sonner";

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<SuperAdminTenant[]>(INITIAL_SUPER_ADMIN_TENANTS);
  const [isExporting, setIsExporting] = useState(false);

  const totalTenants = tenants.length;
  const activeCount = tenants.filter((t) => t.status === "active").length;
  const suspendedCount = tenants.filter((t) => t.status === "suspended").length;
  const totalTables = tenants.reduce((acc, t) => acc + t.tableCount, 0);
  const totalGmvSum = tenants.reduce((acc, t) => acc + t.totalGmv, 0);

  // Toggle Active / Suspended
  const handleToggleTenantStatus = (tenantId: string, nextStatus: TenantStatus) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const msg =
          nextStatus === "suspended"
            ? `Kemitraan "${t.name}" berhasil dibekukan (ditangguhkan).`
            : `Kemitraan "${t.name}" berhasil diaktifkan kembali.`;
        if (nextStatus === "suspended") {
          toast.warning(msg, { id: `tenant-${tenantId}` });
        } else {
          toast.success(msg, { id: `tenant-${tenantId}` });
        }
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleExportTenantsExcel = async () => {
    setIsExporting(true);
    try {
      await exportSuperAdminTenantsToExcel({
        reportPeriod: "Agustus 2026",
        totalTenants: totalTenants,
        activeTenants: activeCount,
        totalGMV: totalGmvSum,
        tenants: tenants.map((t) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          ownerName: t.ownerName,
          phone: t.phone,
          tableCount: t.tableCount,
          totalGmv: t.totalGmv,
          bankAccount: `${t.bankName} - ${t.bankAccount} (a.n ${t.accountHolder})`,
          status: t.status === "active" ? "Aktif" : "Ditangguhkan",
        })),
      });

      toast.success("File Excel master direktori mitra berhasil diunduh.", {
        id: "export-tenants-toast",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunduh Excel.";
      toast.error(msg, { id: "export-tenants-toast" });
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
            Direktori Seluruh Mitra Restoran
          </h1>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
            Daftar master seluruh restoran mitra yang beroperasi di platform QuickDine se-Indonesia.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleExportTenantsExcel}
          isLoading={isExporting}
          className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 px-4 gap-1.5 shrink-0 shadow-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export Data Mitra (.xlsx)</span>
        </Button>
      </div>

      {/* Stats Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#131b2e]">
            <Store className="h-4 w-4 text-[#006948]" />
          </div>
          <div>
            <span className="text-[10px] text-[#6d7a72] font-semibold block">Total Restoran</span>
            <span className="text-base font-extrabold text-[#131b2e]">{totalTenants} Mitra</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#006948] font-semibold block">Mitra Aktif</span>
            <span className="text-base font-extrabold text-[#006948]">{activeCount} Restoran</span>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
            <Ban className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-red-600 font-semibold block">Ditangguhkan</span>
            <span className="text-base font-extrabold text-red-700">{suspendedCount} Restoran</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Table2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#6d7a72] font-semibold block">Total Meja Live</span>
            <span className="text-base font-extrabold text-[#131b2e]">{totalTables} Meja</span>
          </div>
        </div>
      </div>

      {/* Banner Shortcut to Verification if needed */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-amber-950 font-semibold">
            Terdapat 3 permohonan kemitraan restoran baru yang menunggu ditinjau.
          </span>
        </div>
        <Link
          href="/super-admin/verifikasi"
          className="flex items-center gap-1 font-bold text-[#006948] hover:underline"
        >
          <span>Buka Antrean Verifikasi</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* All Tenants Directory Table */}
      <TenantDirectoryTable
        tenants={tenants}
        onToggleTenantStatus={handleToggleTenantStatus}
      />
    </div>
  );
}
