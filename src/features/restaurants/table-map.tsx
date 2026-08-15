"use client";

import { TableItemDetail } from "./restaurant-details-data";
import { Users, Check, Lock, ShieldAlert } from "lucide-react";
import { SelectedTable } from "@/features/orders/cart-store";

interface TableMapProps {
  tables: TableItemDetail[];
  selectedTable: SelectedTable | null;
  onSelectTable: (table: SelectedTable) => void;
}

export function TableMap({
  tables,
  selectedTable,
  onSelectTable,
}: TableMapProps) {
  return (
    <div className="space-y-4">
      {/* Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-[#bccac0]/40 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-[#131b2e]">Denah Meja Restoran (Live)</h3>
          <p className="text-[11px] text-[#6d7a72]">Klik meja yang bertanda hijau untuk memilih tempat duduk Anda</p>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#131b2e] font-medium">Tersedia</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[#131b2e] font-medium">Sedang Dipesan</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="text-[#6d7a72]">Terisi</span>
          </div>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {tables.map((table) => {
          const isSelected = selectedTable?.number === table.number;
          const isVacant = table.status === "vacant";
          const isLocked = table.status === "locked";
          const isOccupied = table.status === "occupied" || table.status === "reserved";

          return (
            <button
              key={table.id}
              type="button"
              disabled={!isVacant}
              onClick={() => {
                if (isVacant) {
                  onSelectTable({
                    id: table.id,
                    number: table.number,
                    capacity: table.capacity,
                  });
                }
              }}
              className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#006948] bg-emerald-50/80 shadow-md ring-2 ring-[#006948]"
                  : isVacant
                  ? "border-emerald-200 bg-white hover:border-[#006948] hover:shadow-sm cursor-pointer"
                  : isLocked
                  ? "border-amber-200 bg-amber-50/50 cursor-not-allowed opacity-80"
                  : "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#006948] text-white">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}

              {/* Table Number */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-base font-extrabold ${
                    isSelected
                      ? "text-[#006948]"
                      : isVacant
                      ? "text-[#131b2e]"
                      : isLocked
                      ? "text-amber-800"
                      : "text-slate-500"
                  }`}
                >
                  Meja {table.number}
                </span>
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-1 text-xs text-[#6d7a72] mt-1">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>{table.capacity} Orang</span>
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                {isVacant ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-[#006948] text-white"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isSelected ? "Meja Terpilih" : "Bisa Dipilih"}
                  </span>
                ) : isLocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    <Lock className="h-2.5 w-2.5" />
                    <span>Dipesan ({table.lockedMinutesLeft || 8}m)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    Tidak Tersedia
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
