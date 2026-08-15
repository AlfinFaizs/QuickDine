"use client";

import { useState } from "react";
import { LayoutGrid, Lock, CheckCircle2, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TableFloor {
  id: string;
  number: string;
  capacity: number;
  status: "vacant" | "locked" | "reserved" | "occupied";
  guestName?: string;
  eta?: string;
}

const INITIAL_TABLES: TableFloor[] = [
  { id: "1", number: "01", capacity: 2, status: "vacant" },
  { id: "2", number: "02", capacity: 4, status: "vacant" },
  { id: "3", number: "03", capacity: 2, status: "locked", guestName: "Sedang Checkout", eta: "Sisa 5 mnt" },
  { id: "4", number: "04", capacity: 4, status: "reserved", guestName: "Alfin Faiz", eta: "12:30 WIB" },
  { id: "5", number: "05", capacity: 6, status: "occupied", guestName: "Keluarga Hendra", eta: "Sedang Makan" },
  { id: "6", number: "06", capacity: 2, status: "vacant" },
];

export default function TablesManagementPage() {
  const [tables, setTables] = useState<TableFloor[]>(INITIAL_TABLES);

  const handleStatusChange = (tableId: string, newStatus: TableFloor["status"]) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t))
    );
    toast.success("Status meja berhasil diubah.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-[#006948]" />
            <span>Manajemen Denah Meja Live (Kasir)</span>
          </h1>
          <p className="text-xs text-[#6d7a72]">
            Pantau status 4 warna penuh dan override meja secara manual untuk tamu walk-in offline.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-3 border border-[#bccac0]/30 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-emerald-800">
          <span className="h-3 w-3 rounded-md bg-emerald-500" /> VACANT (Kosong)
        </span>
        <span className="flex items-center gap-1.5 font-medium text-amber-800">
          <span className="h-3 w-3 rounded-md bg-amber-400" /> LOCKED (Sedang Checkout)
        </span>
        <span className="flex items-center gap-1.5 font-medium text-blue-800">
          <span className="h-3 w-3 rounded-md bg-blue-500" /> RESERVED (Sudah Bayar / Menunggu)
        </span>
        <span className="flex items-center gap-1.5 font-medium text-slate-800">
          <span className="h-3 w-3 rounded-md bg-slate-600" /> OCCUPIED (Aktif Makan)
        </span>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => {
          const isVacant = table.status === "vacant";
          const isLocked = table.status === "locked";
          const isReserved = table.status === "reserved";
          const isOccupied = table.status === "occupied";

          return (
            <div
              key={table.id}
              className={`rounded-2xl border p-5 bg-white shadow-2xs space-y-3 ${
                isVacant
                  ? "border-emerald-300"
                  : isLocked
                  ? "border-amber-300 bg-amber-50/40"
                  : isReserved
                  ? "border-blue-300 bg-blue-50/40"
                  : "border-slate-300 bg-slate-50/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">Meja {table.number}</h3>
                  <span className="text-xs text-[#6d7a72]">{table.capacity} Kursi</span>
                </div>
                <Badge
                  variant={
                    isVacant ? "success" : isLocked ? "warning" : isReserved ? "default" : "secondary"
                  }
                  className="uppercase text-[10px]"
                >
                  {table.status}
                </Badge>
              </div>

              {table.guestName && (
                <div className="text-xs text-[#131b2e] bg-white p-2 rounded-lg border border-[#bccac0]/30">
                  <span className="font-semibold block">{table.guestName}</span>
                  <span className="text-[11px] text-[#6d7a72]">{table.eta}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#bccac0]/20 flex gap-2">
                {isVacant && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(table.id, "occupied")}
                    className="w-full text-xs h-8 bg-[#006948] hover:bg-[#005137]"
                  >
                    Walk-In Check-In
                  </Button>
                )}
                {isReserved && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(table.id, "occupied")}
                    className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Tamu Tiba (Check-In)
                  </Button>
                )}
                {(isOccupied || isLocked) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(table.id, "vacant")}
                    className="w-full text-xs h-8"
                  >
                    Clear Table (Kosongkan)
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
