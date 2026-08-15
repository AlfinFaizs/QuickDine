"use client";
// src/features/super-admin/tenant-approval-queue.tsx
// Komponen antrean verifikasi mitra baru dengan pagination 3-kartu per halaman dan tombol buka/tutup (anti-clutter)

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Phone,
  Landmark,
  Table2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PendingPartnerApplication } from "@/features/super-admin/super-admin-data";

interface Props {
  applications: PendingPartnerApplication[];
  onApprove: (app: PendingPartnerApplication) => void;
  onReject: (app: PendingPartnerApplication) => void;
}

const ITEMS_PER_PAGE = 3;

export function TenantApprovalQueue({
  applications,
  onApprove,
  onReject,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedApp, setSelectedApp] = useState<PendingPartnerApplication | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject">("approve");

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return applications.slice(start, start + ITEMS_PER_PAGE);
  }, [applications, safePage]);

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 text-center space-y-1.5 shadow-2xs">
        <CheckCircle2 className="mx-auto h-7 w-7 text-[#006948]" />
        <h3 className="text-sm font-bold text-[#131b2e]">
          Semua Pendaftaran Mitra Telah Terverifikasi
        </h3>
        <p className="text-xs text-[#6d7a72]">
          Tidak ada antrean calon mitra restoran baru yang menunggu persetujuan saat ini.
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
    if (paginatedItems.length === 1 && safePage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/25 p-5 space-y-4 shadow-2xs">
      {/* Header Bar with Counter, Page Indicator, and Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#131b2e] flex items-center gap-2">
              <span>Antrean Verifikasi Mitra Baru</span>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white">
                {applications.length} Pendaftar
              </span>
            </h2>
            <p className="text-[11px] text-[#6d7a72]">
              Tinjau pendaftaran calon mitra dari formulir publik /daftar-mitra
            </p>
          </div>
        </div>

        {/* Carousel Controls & Collapse Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!isCollapsed && totalPages > 1 && (
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-semibold text-[#131b2e]">
              <span className="text-[11px] text-[#6d7a72]">
                Hal. {safePage} / {totalPages}
              </span>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="h-8 text-xs font-bold border-amber-300 text-amber-900 bg-white hover:bg-amber-100/60 gap-1 rounded-xl"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Buka ({applications.length})</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Sembunyikan</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Grid of 3 Paginated Cards (Only visible if not collapsed) */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-amber-200 bg-white p-4 space-y-3.5 shadow-2xs flex flex-col justify-between hover:border-amber-400 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#131b2e] leading-snug line-clamp-1">
                      {app.restaurantName}
                    </h3>
                    <span className="inline-block text-[9px] font-semibold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
                      {app.category}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#6d7a72] whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                    {app.appliedDate.slice(0, 11)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#131b2e] bg-slate-50 p-2.5 rounded-lg border border-[#bccac0]/25">
                  <div className="flex items-center gap-2">
                    <Store className="h-3 w-3 text-[#6d7a72] shrink-0" />
                    <span className="truncate text-[11px] font-semibold">{app.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-[#6d7a72] shrink-0" />
                    <span className="font-mono text-[11px]">{app.ownerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Table2 className="h-3 w-3 text-[#6d7a72] shrink-0" />
                    <span className="text-[11px]">{app.tableCount} Meja Operasional</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#bccac0]/20">
                    <Landmark className="h-3 w-3 text-[#006948] shrink-0" />
                    <span className="text-[10px] truncate font-medium text-[#006948]">
                      {app.bankName} - {app.bankAccount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApp(app);
                    setDialogAction("reject");
                  }}
                  className="flex-1 text-[11px] h-8 font-semibold text-red-600 border-red-200 hover:bg-red-50 gap-1 rounded-lg"
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
                  className="flex-1 text-[11px] h-8 font-bold bg-[#006948] hover:bg-[#005137] text-white gap-1 shadow-2xs rounded-lg"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Setujui</span>
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
