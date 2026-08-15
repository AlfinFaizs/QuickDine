"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Clock, 
  Lock, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  PlusCircle, 
  Eye, 
  RefreshCw 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardTable, TableStatus } from "./tables-data";

interface TableCardProps {
  table: DashboardTable;
  onOpenWalkin: (table: DashboardTable) => void;
  onOpenDetail: (table: DashboardTable) => void;
  onStatusChange: (tableId: string, status: TableStatus) => void;
}

export function TableCard({
  table,
  onOpenWalkin,
  onOpenDetail,
  onStatusChange,
}: TableCardProps) {
  const isVacant = table.status === "vacant";
  const isLocked = table.status === "locked";
  const isReserved = table.status === "reserved";
  const isOccupied = table.status === "occupied";
  const isMaintenance = table.status === "maintenance";

  // Lock countdown timer for LOCKED state
  const [remainingSeconds, setRemainingSeconds] = useState(
    table.activeOrder?.lockRemainingSeconds || 480
  );

  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onStatusChange(table.id, "vacant");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, table.id, onStatusChange]);

  const formatLockTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3.5 transition-all duration-200 hover:shadow-md ${
        isVacant
          ? "border-emerald-300 hover:border-emerald-500"
          : isLocked
          ? "border-amber-300 bg-amber-50/20"
          : isReserved
          ? "border-blue-300 bg-blue-50/20"
          : isOccupied
          ? "border-slate-400 bg-slate-50/40"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* ── Table Header & Badges ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#131b2e]">Meja {table.number}</span>
            <span className="text-[10px] font-semibold text-[#6d7a72] bg-slate-100 px-2 py-0.5 rounded-md">
              {table.area}
            </span>
          </div>
          <span className="text-xs text-[#6d7a72] flex items-center gap-1 mt-0.5">
            <Users className="h-3.5 w-3.5 text-[#006948]" />
            <span>Kapasitas {table.capacity} Kursi</span>
          </span>
        </div>

        {/* State Badge */}
        <div>
          {isVacant && (
            <Badge variant="success" className="text-[10px] font-bold uppercase gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Vacant
            </Badge>
          )}

          {isLocked && (
            <Badge variant="warning" className="text-[10px] font-bold uppercase gap-1 animate-pulse">
              <Lock className="h-3 w-3" />
              Locked ({formatLockTimer(remainingSeconds)})
            </Badge>
          )}

          {isReserved && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold uppercase gap-1">
              <Clock className="h-3 w-3 text-blue-600" />
              Reserved
            </Badge>
          )}

          {isOccupied && (
            <Badge variant="secondary" className="text-[10px] font-bold uppercase gap-1 bg-slate-200 text-slate-800">
              <UserCheck className="h-3 w-3 text-slate-600" />
              Occupied
            </Badge>
          )}
        </div>
      </div>

      {/* ── Active Order Summary (If Any) ── */}
      <div className="min-h-[64px] rounded-xl bg-[#faf8ff] p-3 border border-[#bccac0]/30 text-xs flex flex-col justify-center">
        {isVacant && (
          <div className="text-center text-[#6d7a72] text-[11px] py-1">
            <span>Meja bersih &amp; siap digunakan tamu baru</span>
          </div>
        )}

        {isLocked && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#131b2e] font-semibold">
              <span>Pelanggan Online</span>
              <span className="text-amber-700 font-mono font-bold">{formatLockTimer(remainingSeconds)}</span>
            </div>
            <p className="text-[10px] text-[#6d7a72]">
              Terkunci otomatis saat pelanggan mengisi data &amp; bayar checkout.
            </p>
          </div>
        )}

        {isReserved && table.activeOrder && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#131b2e]">{table.activeOrder.customerName}</span>
              <span className="text-[11px] font-bold text-blue-700">Tiba {table.activeOrder.arrivalTime}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#6d7a72]">
              <span>{table.activeOrder.items.length} Menu dipesan</span>
              <span className="text-[#006948] font-bold">
                {table.activeOrder.kitchenStatus === "ready" ? "✨ Makanan Siap" : "🍳 Sedang Masak"}
              </span>
            </div>
          </div>
        )}

        {isOccupied && table.activeOrder && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#131b2e]">{table.activeOrder.customerName}</span>
              <span className="text-[10px] text-slate-500">{table.activeOrder.guestCount} Tamu</span>
            </div>
            <div className="text-[10px] text-[#6d7a72]">
              <span>{table.activeOrder.seatedSince || "Sedang makan di meja"}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="pt-1 flex items-center gap-2">
        {isVacant && (
          <>
            <Button
              size="sm"
              onClick={() => onOpenWalkin(table)}
              className="flex-1 bg-[#006948] hover:bg-[#005137] text-white text-xs h-9 gap-1 font-bold shadow-2xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Walk-In</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetail(table)}
              className="text-xs h-9 px-2.5 text-[#6d7a72] hover:text-[#131b2e]"
              title="Lihat Detail Meja"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </>
        )}

        {isReserved && (
          <>
            <Button
              size="sm"
              onClick={() => onStatusChange(table.id, "occupied")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 gap-1 font-bold shadow-2xs"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Tamu Tiba (Check-In)</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetail(table)}
              className="text-xs h-9 px-2.5 text-blue-700 border-blue-200 hover:bg-blue-50"
              title="Lihat Rincian Pesanan"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </>
        )}

        {isOccupied && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(table.id, "vacant")}
              className="flex-1 text-xs h-9 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#006948]" />
              <span>Kosongkan Meja</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetail(table)}
              className="text-xs h-9 px-2.5 text-[#6d7a72] hover:text-[#131b2e]"
              title="Lihat Tagihan & Pesanan"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </>
        )}

        {isLocked && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(table.id, "vacant")}
              className="flex-1 text-xs h-9 border-amber-300 text-amber-800 hover:bg-amber-100/50 font-semibold gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Buka Kunci Manual</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetail(table)}
              className="text-xs h-9 px-2.5 text-amber-700 border-amber-200"
              title="Lihat Detail Lock"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
