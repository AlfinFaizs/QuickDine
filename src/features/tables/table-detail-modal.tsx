"use client";
// src/features/tables/table-detail-modal.tsx
// Modal aksi detail meja — check-in, no-show, kosongkan

import { X, UserCheck, PackageOpen, Trash2, Clock, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_CONFIG, type DashboardTable } from "@/features/tables/tables-data";

interface Props {
  table: DashboardTable;
  onClose: () => void;
  onAction: (tableId: string, action: "checkin" | "noshow" | "clear") => void;
}

export function TableDetailModal({ table, onClose, onAction }: Props) {
  const cfg = STATUS_CONFIG[table.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.vacant;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${cfg.bg} ${cfg.border}`}>
          <div>
            <h2 className="text-base font-extrabold text-[#131b2e]">
              Meja {table.number}
            </h2>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-black/10 transition-colors"
          >
            <X className="h-5 w-5 text-[#131b2e]" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Guest Info */}
          {table.guestName && (
            <div className="rounded-xl bg-[#f2f3ff] p-3 space-y-1.5 text-sm">
              <span className="font-bold text-[#131b2e] block">{table.guestName}</span>
              {table.eta && (
                <span className="text-xs text-[#6d7a72] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#006948]" />
                  <span>ETA: {table.eta}</span>
                </span>
              )}
              {table.phone && (
                <span className="text-xs text-[#6d7a72] flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-[#006948]" />
                  <span>{table.phone}</span>
                </span>
              )}
              {table.orderId && (
                <span className="text-[10px] font-mono text-[#006948] block">
                  #{table.orderId}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {/* Reserved → Check In */}
            {table.status === "reserved" && (
              <Button
                onClick={() => onAction(table.id, "checkin")}
                className="w-full bg-[#006948] hover:bg-[#005137] text-white font-bold text-sm h-11 gap-2"
              >
                <UserCheck className="h-5 w-5" />
                Tamu Tiba — Check-In Sekarang
              </Button>
            )}

            {/* Reserved/Occupied → No-Show */}
            {(table.status === "reserved" || table.status === "occupied") && (
              <Button
                onClick={() => onAction(table.id, "noshow")}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50 font-bold text-sm h-11 gap-2"
              >
                <PackageOpen className="h-5 w-5" />
                Trigger No-Show — Bungkus &amp; Lepas Meja
              </Button>
            )}

            {/* Occupied/Locked → Clear */}
            {(table.status === "occupied" || table.status === "locked") && (
              <Button
                onClick={() => onAction(table.id, "clear")}
                variant="outline"
                className="w-full text-slate-700 border-slate-300 hover:bg-slate-50 font-semibold text-sm h-11 gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Kosongkan Meja (Tamu Selesai)
              </Button>
            )}

            {/* Vacant actions — nothing actionable */}
            {table.status === "vacant" && (
              <p className="text-sm text-center text-[#6d7a72] py-2">
                Meja ini kosong dan siap untuk tamu baru.
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-xs text-[#6d7a72] h-9"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
