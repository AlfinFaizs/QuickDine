"use client";
// src/app/(super-admin)/super-admin/tenants/page.tsx
// Halaman Khusus Direktori Mitra Restoran & Kontrol Status Kemitraan

import { useState } from "react";
import { FileSpreadsheet, Store, CheckCircle2, Ban } from "lucide-react";
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

  // Statistics
  const totalTenants = tenants.length;
  const activeCount = tenants.filter((t) => t.status === "active").length;
  const suspendedCount = tenants.filter((t) => t.status === "suspended").length;
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
            Daftar seluruh restoran mitra terintegrasi, pemantauan volume omset per resto, dan kontrol pembekuan akun.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#131b2e]">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#6d7a72] font-semibold block">Total Mitra Terdaftar</span>
            <span className="text-base font-extrabold text-[#131b2e]">{totalTenants} Restoran</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#006948] font-semibold block">Mitra Aktif Beroperasi</span>
            <span className="text-base font-extrabold text-[#006948]">{activeCount} Restoran</span>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
            <Ban className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-red-600 font-semibold block">Mitra Ditangguhkan</span>
            <span className="text-base font-extrabold text-red-700">{suspendedCount} Restoran</span>
          </div>
        </div>
      </div>

      {/* All Tenants Directory Table */}
      <TenantDirectoryTable
        tenants={tenants}
        onToggleTenantStatus={handleToggleTenantStatus}
      />
    </div>
  );
}
