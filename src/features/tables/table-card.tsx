"use client";
// src/features/tables/table-card.tsx
// Kartu meja individual untuk Denah Meja Kasir

import { Users, Clock, PhoneCall, ChevronRight } from "lucide-react";
import { STATUS_CONFIG, type DashboardTable } from "@/features/tables/tables-data";

interface Props {
  table: DashboardTable;
  onClick: () => void;
}

export function TableCard({ table, onClick }: Props) {
  const cfg = STATUS_CONFIG[table.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.vacant;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-4 space-y-3 transition-all hover:shadow-md active:scale-[0.98] ${cfg.bg} ${cfg.border}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#131b2e]">
              Meja {table.number}
            </span>
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${cfg.dot}`}
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-[#6d7a72] mt-0.5">
            <Users className="h-3 w-3" />
            <span>{table.capacity} Kursi</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.badge}`}
          >
            {cfg.label}
          </span>
          <ChevronRight className="h-4 w-4 text-[#6d7a72]" />
        </div>
      </div>

      {/* Guest Info */}
      {table.guestName && (
        <div className="rounded-xl bg-white/70 border border-white px-3 py-2 space-y-1">
          <span className="text-xs font-bold text-[#131b2e] block">
            {table.guestName}
          </span>
          {table.eta && (
            <div className="flex items-center gap-1 text-[11px] text-[#6d7a72]">
              <Clock className="h-3 w-3" />
              <span>{table.eta}</span>
            </div>
          )}
          {table.phone && (
            <div className="flex items-center gap-1 text-[11px] text-[#6d7a72]">
              <PhoneCall className="h-3 w-3" />
              <span>{table.phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Vacant hint */}
      {table.status === "vacant" && (
        <p className="text-[11px] text-emerald-700 font-medium">
          ✅ Siap untuk tamu walk-in atau reservasi
        </p>
      )}
    </button>
  );
}
