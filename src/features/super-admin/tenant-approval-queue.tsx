"use client";
// src/features/super-admin/tenant-approval-queue.tsx
// Komponen antrean verifikasi & persetujuan mitra restoran pendaftar baru

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Phone,
  Landmark,
  Table2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PendingPartnerApplication } from "@/features/super-admin/super-admin-data";

interface Props {
  applications: PendingPartnerApplication[];
  onApprove: (app: PendingPartnerApplication) => void;
  onReject: (app: PendingPartnerApplication) => void;
}

export function TenantApprovalQueue({
  applications,
  onApprove,
  onReject,
}: Props) {
  const [selectedApp, setSelectedApp] = useState<PendingPartnerApplication | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject">("approve");

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-6 text-center space-y-2">
        <CheckCircle2 className="mx-auto h-8 w-8 text-[#006948]" />
        <h3 className="text-sm font-bold text-[#131b2e]">
          Semua Pendaftaran Mitra Telah Diverifikasi
        </h3>
        <p className="text-xs text-[#6d7a72]">
          Tidak ada antrean mitra restoran baru yang menunggu persetujuan saat ini.
        </p>
      </div>
    );
  }

  const handleConfirmAction = () => {
    if (!selectedApp) return;
    if (dialogAction === "approve") {
      onApprove(selectedApp);
    } else {
      onReject(selectedApp);
    }
    setSelectedApp(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-white">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-extrabold text-[#131b2e]">
            Antrean Verifikasi Pendaftar Mitra Baru ({applications.length})
          </h2>
        </div>
        <span className="text-[11px] text-[#6d7a72]">
          Calon mitra yang mengisi form pendaftaran mandiri
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-amber-200 bg-amber-50/20 p-5 space-y-4 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#131b2e] leading-snug">
                    {app.restaurantName}
                  </h3>
                  <span className="inline-block text-[10px] font-semibold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                    {app.category}
                  </span>
                </div>
                <span className="text-[10px] text-[#6d7a72] whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {app.appliedDate.slice(0, 11)}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#131b2e] bg-white p-3 rounded-xl border border-[#bccac0]/30">
                <div className="flex items-center gap-2">
                  <Store className="h-3.5 w-3.5 text-[#6d7a72] shrink-0" />
                  <span className="truncate">{app.ownerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#6d7a72] shrink-0" />
                  <span className="font-mono">{app.ownerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Table2 className="h-3.5 w-3.5 text-[#6d7a72] shrink-0" />
                  <span>{app.tableCount} Meja Operasional</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-[#bccac0]/20">
                  <Landmark className="h-3.5 w-3.5 text-[#006948] shrink-0" />
                  <span className="text-[11px] truncate">
                    {app.bankName} {app.bankAccount}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-amber-200/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedApp(app);
                  setDialogAction("reject");
                }}
                className="flex-1 text-xs h-9 font-semibold text-red-600 border-red-200 hover:bg-red-50 gap-1"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Tolak</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setSelectedApp(app);
                  setDialogAction("approve");
                }}
                className="flex-1 text-xs h-9 font-bold bg-[#006948] hover:bg-[#005137] text-white gap-1 shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Setujui Mitra</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(selectedApp)}
        title={
          dialogAction === "approve"
            ? `Setujui Kemitraan "${selectedApp?.restaurantName}"?`
            : `Tolak Pendaftaran "${selectedApp?.restaurantName}"?`
        }
        description={
          dialogAction === "approve"
            ? `Restoran ini akan otomatis aktif di platform QuickDine, dapat mulai membuka reservasi, dan menerima pembayaran pesanan.`
            : `Pendaftaran kemitraan restoran ini akan dibatalkan.`
        }
        confirmLabel={
          dialogAction === "approve" ? "Ya, Setujui Mitra" : "Ya, Tolak Pendaftaran"
        }
        variant={dialogAction === "approve" ? "primary" : "danger"}
        onConfirm={handleConfirmAction}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
}
