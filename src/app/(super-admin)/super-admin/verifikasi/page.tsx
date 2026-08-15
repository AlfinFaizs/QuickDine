"use client";
// src/app/(super-admin)/super-admin/verifikasi/page.tsx
// Halaman Khusus Verifikasi & Persetujuan Pendaftaran Mitra Restoran Baru

import { useState } from "react";
import { UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TenantApprovalQueue } from "@/features/super-admin/tenant-approval-queue";
import {
  INITIAL_PENDING_APPLICATIONS,
  type PendingPartnerApplication,
} from "@/features/super-admin/super-admin-data";
import { toast } from "sonner";

export default function SuperAdminVerifikasiPage() {
  const [pendingApps, setPendingApps] = useState<PendingPartnerApplication[]>(
    INITIAL_PENDING_APPLICATIONS
  );

  const handleApprovePartner = (app: PendingPartnerApplication) => {
    setPendingApps((prev) => prev.filter((a) => a.id !== app.id));
    toast.success(`Kemitraan "${app.restaurantName}" berhasil disetujui & diaktifkan di platform!`, {
      id: "partner-approve-toast",
    });
  };

  const handleRejectPartner = (app: PendingPartnerApplication) => {
    setPendingApps((prev) => prev.filter((a) => a.id !== app.id));
    toast.info(`Pendaftaran kemitraan "${app.restaurantName}" telah ditolak.`, {
      id: "partner-reject-toast",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/super-admin"
              className="p-1 rounded-lg text-[#6d7a72] hover:bg-slate-100 hover:text-[#131b2e] transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
              Verifikasi Pendaftar Mitra Restoran Baru
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5 ml-6">
            Tinjau data legalitas, nomor rekening payout, dan jumlah meja calon restoran pendaftar sebelum diaktifkan ke publik.
          </p>
        </div>
      </div>

      {/* Approval Queue Section */}
      <TenantApprovalQueue
        applications={pendingApps}
        onApprove={handleApprovePartner}
        onReject={handleRejectPartner}
      />
    </div>
  );
}
