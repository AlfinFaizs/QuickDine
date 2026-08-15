"use client";
// src/app/(super-admin)/super-admin/verifikasi/page.tsx
// Halaman Khusus Antrean Verifikasi & Persetujuan Calon Mitra Pendaftar Baru

import { useState } from "react";
import { UserCheck, Clock, CheckCircle2, XCircle, Store, Phone, Mail, MapPin, Table2, Landmark, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { INITIAL_PENDING_APPLICATIONS, type PendingPartnerApplication } from "@/features/super-admin/super-admin-data";
import { toast } from "sonner";

export default function SuperAdminVerificationPage() {
  const [applications, setApplications] = useState<PendingPartnerApplication[]>(INITIAL_PENDING_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<PendingPartnerApplication | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject">("approve");

  const handleConfirmAction = () => {
    if (!selectedApp) return;

    if (dialogAction === "approve") {
      setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id));
      toast.success(`Kemitraan "${selectedApp.restaurantName}" telah disetujui & otomatis aktif di sistem.`, {
        id: "verify-partner-toast",
      });
    } else {
      setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id));
      toast.info(`Pendaftaran "${selectedApp.restaurantName}" telah ditolak.`, {
        id: "verify-partner-toast",
      });
    }
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
              Verifikasi Pendaftaran Mitra Baru
            </h1>
            {applications.length > 0 && (
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-black">
                {applications.length} Antrean
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
            Tinjau kelengkapan profil restoran, kontak pemilik, dan rekening pencairan sebelum mengaktifkan mitra di platform.
          </p>
        </div>
      </div>

      {/* Guide Alert */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900">
        <ShieldAlert className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Panduan Verifikasi Keamanan Platform:</span>
          Pastikan nomor WhatsApp dan rekening bank valid atas nama pemilik resto untuk mencegah kendala pencairan dana harian (H+1).
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-12 text-center space-y-3 shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#006948] mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-base font-extrabold text-[#131b2e]">
            Seluruh Pendaftaran Mitra Telah Bersih
          </h2>
          <p className="text-xs text-[#6d7a72] max-w-md mx-auto">
            Tidak ada calon mitra yang menunggu persetujuan. Setiap permohonan baru yang masuk dari form registrasi akan langsung muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-amber-200 bg-white p-5 space-y-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3 border-b border-[#bccac0]/20 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#131b2e]">
                      {app.restaurantName}
                    </h3>
                    <span className="inline-block text-[11px] font-semibold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                      {app.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#6d7a72] bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {app.appliedDate}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#131b2e]">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Store className="h-4 w-4 text-[#6d7a72] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#6d7a72] block">Nama Pemilik</span>
                      <span className="font-bold truncate block">{app.ownerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone className="h-4 w-4 text-[#6d7a72] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#6d7a72] block">No. WhatsApp</span>
                      <span className="font-mono font-bold truncate block">{app.ownerPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Mail className="h-4 w-4 text-[#6d7a72] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#6d7a72] block">Email Bisnis</span>
                      <span className="truncate block font-medium">{app.ownerEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Table2 className="h-4 w-4 text-[#6d7a72] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#6d7a72] block">Kapasitas Meja</span>
                      <span className="font-bold block">{app.tableCount} Meja Operasional</span>
                    </div>
                  </div>
                </div>

                {/* Address & Bank Account */}
                <div className="space-y-2 text-xs pt-1">
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin className="h-4 w-4 text-[#6d7a72] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#6d7a72] block">Alamat Outlet</span>
                      <span className="text-[#131b2e] leading-snug block">{app.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60">
                    <Landmark className="h-4 w-4 text-[#006948] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#006948] font-bold block">Rekening Bank Pencairan (H+1)</span>
                      <span className="text-[#131b2e] font-bold block">
                        {app.bankName} — {app.bankAccount}
                      </span>
                      <span className="text-[11px] text-[#6d7a72] block">a.n. {app.accountHolder}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#bccac0]/20">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApp(app);
                    setDialogAction("reject");
                  }}
                  className="flex-1 text-xs h-10 font-bold text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Tolak Permohonan</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedApp(app);
                    setDialogAction("approve");
                  }}
                  className="flex-1 text-xs h-10 font-bold bg-[#006948] hover:bg-[#005137] text-white gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Setujui Kemitraan</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            ? "Restoran akan otomatis aktif di platform QuickDine, siap menerima reservasi meja tamu dan order makanan."
            : "Permohonan pendaftaran restoran ini akan dibatalkan."
        }
        confirmLabel={
          dialogAction === "approve" ? "Ya, Setujui Mitra" : "Ya, Tolak Permohonan"
        }
        variant={dialogAction === "approve" ? "primary" : "danger"}
        onConfirm={handleConfirmAction}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
}
