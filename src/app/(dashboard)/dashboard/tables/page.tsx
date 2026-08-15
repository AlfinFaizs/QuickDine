"use client";

import { useState } from "react";
import { LayoutGrid, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableCard } from "@/features/tables/table-card";
import { TableDetailModal } from "@/features/tables/table-detail-modal";
import { TableWalkInModal } from "@/features/tables/table-walkin-modal";
import {
  INITIAL_TABLES,
  STATUS_CONFIG,
  type DashboardTable,
  type TableStatus,
} from "@/features/tables/tables-data";

export default function TablesManagementPage() {
  const [tables, setTables] = useState<DashboardTable[]>(INITIAL_TABLES);
  const [selectedTable, setSelectedTable] = useState<DashboardTable | null>(null);
  const [walkInTable, setWalkInTable] = useState<DashboardTable | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | TableStatus>("all");

  const handleCardClick = (table: DashboardTable) => {
    if (table.status === "vacant") {
      setWalkInTable(table);
    } else {
      setSelectedTable(table);
    }
  };

  const handleDetailAction = (
    tableId: string,
    action: "checkin" | "noshow" | "clear"
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        if (action === "checkin") {
          toast.success(`✅ Tamu tiba! Meja ${t.number} → OCCUPIED.`);
          return { ...t, status: "occupied" as TableStatus };
        }
        if (action === "noshow") {
          toast.warning(`📦 No-Show: Meja ${t.number} dikosongkan kembali.`);
          return { id: t.id, number: t.number, capacity: t.capacity, status: "vacant" as TableStatus };
        }
        if (action === "clear") {
          toast.success(`🧹 Meja ${t.number} berhasil dikosongkan.`);
          return { id: t.id, number: t.number, capacity: t.capacity, status: "vacant" as TableStatus };
        }
        return t;
      })
    );
    setSelectedTable(null);
  };

  const handleWalkIn = (tableId: string, guestName: string, phone: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: "occupied" as TableStatus,
              guestName,
              phone,
              eta: "Sedang Makan",
            }
          : t
      )
    );
    toast.success(`✅ Walk-in "${guestName}" berhasil check-in ke Meja ${tables.find((t) => t.id === tableId)?.number}.`);
    setWalkInTable(null);
  };

  const filtered =
    filterStatus === "all"
      ? tables
      : tables.filter((t) => t.status === filterStatus);

  // Summary counts
  const counts = {
    vacant: tables.filter((t) => t.status === "vacant").length,
    locked: tables.filter((t) => t.status === "locked").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
  };

  const filterOptions: { key: "all" | TableStatus; label: string }[] = [
    { key: "all", label: `Semua (${tables.length})` },
    { key: "vacant", label: `Kosong (${counts.vacant})` },
    { key: "reserved", label: `Reserved (${counts.reserved})` },
    { key: "occupied", label: `Terisi (${counts.occupied})` },
    { key: "locked", label: `Locked (${counts.locked})` },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-[#006948]" />
            Denah Meja Live — Kontrol Kasir
          </h1>
          <p className="text-xs text-[#6d7a72] mt-0.5">
            Klik meja untuk melihat detail dan mengambil tindakan. Meja kosong dapat diisi tamu walk-in.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTables(INITIAL_TABLES)}
          className="gap-1.5 text-xs h-9 shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Demo
        </Button>
      </div>

      {/* Status Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white border border-[#bccac0]/30 p-3">
        {(Object.entries(STATUS_CONFIG) as [TableStatus, typeof STATUS_CONFIG[TableStatus]][]).map(
          ([key, cfg]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs font-medium text-[#131b2e]">
              <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          )
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["vacant", "reserved", "occupied", "locked"] as TableStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className={`rounded-xl border-2 p-3 text-center ${cfg.bg} ${cfg.border}`}>
              <p className="text-2xl font-extrabold text-[#131b2e]">{counts[s]}</p>
              <p className="text-[10px] text-[#6d7a72] mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilterStatus(opt.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filterStatus === opt.key
                ? "bg-[#006948] text-white shadow-sm"
                : "bg-white text-[#131b2e] border border-[#bccac0]/40 hover:bg-[#f2f3ff]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => handleCardClick(table)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTable && (
        <TableDetailModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onAction={handleDetailAction}
        />
      )}

      {/* Walk-In Modal */}
      {walkInTable && (
        <TableWalkInModal
          table={walkInTable}
          onClose={() => setWalkInTable(null)}
          onConfirm={handleWalkIn}
        />
      )}
    </div>
  );
}
