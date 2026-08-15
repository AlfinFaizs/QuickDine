"use client";

import { useState } from "react";
import { 
  LayoutGrid, 
  PlusCircle, 
  Users, 
  Lock, 
  Clock, 
  UserCheck, 
  Percent, 
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  INITIAL_DASHBOARD_TABLES, 
  DashboardTable, 
  TableStatus, 
  TableArea 
} from "@/features/tables/tables-data";
import { TableCard } from "@/features/tables/table-card";
import { TableWalkinModal } from "@/features/tables/table-walkin-modal";
import { TableDetailModal } from "@/features/tables/table-detail-modal";

export default function TablesManagementPage() {
  const [tables, setTables] = useState<DashboardTable[]>(INITIAL_DASHBOARD_TABLES);
  const [activeArea, setActiveArea] = useState<"All" | TableArea>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | TableStatus>("All");

  // Modals state
  const [walkinModalTable, setWalkinModalTable] = useState<DashboardTable | null>(null);
  const [detailModalTable, setDetailModalTable] = useState<DashboardTable | null>(null);

  // Statistics
  const totalTables = tables.length;
  const vacantCount = tables.filter((t) => t.status === "vacant").length;
  const lockedCount = tables.filter((t) => t.status === "locked").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const occupancyRate = Math.round(((occupiedCount + reservedCount) / totalTables) * 100);

  // Status Change Handler
  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        if (newStatus === "vacant") {
          return { ...t, status: "vacant", activeOrder: undefined };
        }
        if (newStatus === "occupied" && t.status === "reserved") {
          return {
            ...t,
            status: "occupied",
            activeOrder: t.activeOrder
              ? {
                  ...t.activeOrder,
                  seatedSince: "Baru saja check-in",
                }
              : undefined,
          };
        }
        return { ...t, status: newStatus };
      })
    );

    if (newStatus === "vacant") {
      toast.success("Meja telah dikosongkan & siap untuk tamu baru.");
    } else if (newStatus === "occupied") {
      toast.success("Tamu berhasil check-in ke meja.");
    } else {
      toast.info(`Status meja diubah menjadi ${newStatus}.`);
    }
  };

  // Walk-In Confirmation Handler
  const handleConfirmWalkin = (
    tableId: string,
    guestName: string,
    guestCount: number,
    notes: string
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          status: "occupied",
          activeOrder: {
            orderId: `wlk-${Date.now()}`,
            orderNumber: `WLK-${Math.floor(100 + Math.random() * 900)}`,
            customerName: guestName,
            customerPhone: "-",
            guestCount,
            arrivalTime: "Walk-in Sekarang",
            seatedSince: "Baru saja duduk",
            kitchenStatus: "received",
            totalAmount: 0,
            paymentMethod: "Walk-in Kasir",
            items: notes ? [{ name: "Catatan Tamu", qty: 1, variant: notes }] : [],
          },
        };
      })
    );
    toast.success(`Tamu walk-in ${guestName} (${guestCount}pax) berhasil didudukkan.`);
  };

  // Filter tables
  const filteredTables = tables.filter((t) => {
    const matchArea = activeArea === "All" || t.area === activeArea;
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchArea && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-white shadow-sm">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
              Kontrol Denah Meja Live (Kasir)
            </h1>
            <p className="text-xs text-[#6d7a72]">
              Pantau status 4 warna secara real-time. Override meja manual &amp; check-in tamu walk-in offline.
            </p>
          </div>
        </div>
      </div>

      {/* ── Top Summary Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Meja Kosong
          </span>
          <span className="text-xl font-black text-[#006948] mt-1 block">
            {vacantCount} <span className="text-xs font-normal text-emerald-700">/ {totalTables}</span>
          </span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-amber-600" /> Locked (10m)
          </span>
          <span className="text-xl font-black text-amber-900 mt-1 block">
            {lockedCount} Meja
          </span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 shadow-2xs">
          <span className="text-[11px] font-semibold text-blue-800 flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-blue-600" /> Reserved
          </span>
          <span className="text-xl font-black text-blue-900 mt-1 block">
            {reservedCount} Meja
          </span>
        </div>

        <div className="rounded-xl border border-slate-300 bg-slate-100 p-3 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
            <UserCheck className="h-3 w-3 text-slate-600" /> Occupied
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 block">
            {occupiedCount} Meja
          </span>
        </div>

        <div className="rounded-xl border border-[#bccac0]/40 bg-white p-3 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-[#6d7a72] flex items-center gap-1.5">
            <Percent className="h-3 w-3 text-[#006948]" /> Occupancy Rate
          </span>
          <span className="text-xl font-black text-[#006948] mt-1 block">
            {occupancyRate}%
          </span>
        </div>
      </div>

      {/* ── Filter Area & Status Pills ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#bccac0]/40 shadow-2xs">
        {/* Area Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["All", "Indoor Utama", "Outdoor Garden", "VIP Room"] as const).map((area) => (
            <button
              key={area}
              onClick={() => setActiveArea(area)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeArea === area
                  ? "bg-[#006948] text-white"
                  : "bg-slate-50 text-[#131b2e] hover:bg-[#f2f3ff]"
              }`}
            >
              {area === "All" ? "Semua Area" : area}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-[#6d7a72] shrink-0 font-medium">Status:</span>
          {(["All", "vacant", "locked", "reserved", "occupied"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                statusFilter === st
                  ? "bg-[#131b2e] text-white"
                  : "bg-slate-100 text-[#6d7a72] hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tables Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onOpenWalkin={setWalkinModalTable}
            onOpenDetail={setDetailModalTable}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* ── Modals ── */}
      <TableWalkinModal
        table={walkinModalTable}
        isOpen={Boolean(walkinModalTable)}
        onClose={() => setWalkinModalTable(null)}
        onConfirmWalkin={handleConfirmWalkin}
      />

      <TableDetailModal
        table={detailModalTable}
        isOpen={Boolean(detailModalTable)}
        onClose={() => setDetailModalTable(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
