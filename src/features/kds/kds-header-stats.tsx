"use client";

import { 
  ChefHat, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Search, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KdsOrder } from "./kds-data";

interface KdsHeaderStatsProps {
  orders: KdsOrder[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function KdsHeaderStats({
  orders,
  soundEnabled,
  onToggleSound,
  searchQuery,
  onSearchChange,
}: KdsHeaderStatsProps) {
  const needsCookingCount = orders.filter((o) => o.status === "received").length;
  const cookingCount = orders.filter((o) => o.status === "cooking").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const alertCount = orders.filter(
    (o) => o.arrivalStatus === "late_grace" || o.arrivalStatus === "tolerance_exceeded"
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Title & Operational Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-white shadow-sm">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
                Kitchen Display System (KDS)
              </h1>
              <p className="text-xs text-[#6d7a72]">
                Layar antrean pesanan dapur real-time. Trigger alarm masak otomatis 15 menit sebelum estimasi tiba.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Sound toggle button */}
          <Button
            type="button"
            variant="outline"
            onClick={onToggleSound}
            className={`text-xs h-9 gap-1.5 border-[#bccac0]/50 ${
              soundEnabled
                ? "bg-emerald-50 text-[#006948] border-emerald-300 font-semibold"
                : "text-[#6d7a72]"
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-[#006948]" />
                <span>Alarm Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-[#6d7a72]" />
                <span>Alarm Hening</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stat Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#bccac0]/30 bg-white p-3 shadow-2xs flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#fea619]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#6d7a72] block">Perlu Dimasak</span>
            <span className="text-base font-extrabold text-[#131b2e]">{needsCookingCount} Pesanan</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#bccac0]/30 bg-white p-3 shadow-2xs flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#6d7a72] block">Sedang Dimasak</span>
            <span className="text-base font-extrabold text-[#131b2e]">{cookingCount} Pesanan</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#bccac0]/30 bg-white p-3 shadow-2xs flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#006948]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#6d7a72] block">Siap Saji di Meja</span>
            <span className="text-base font-extrabold text-[#131b2e]">{readyCount} Pesanan</span>
          </div>
        </div>

        <div className={`rounded-xl border p-3 shadow-2xs flex items-center gap-3 ${
          alertCount > 0 ? "bg-red-50/70 border-red-200" : "bg-white border-[#bccac0]/30"
        }`}>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            alertCount > 0 ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-500"
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#6d7a72] block">Peringatan Keterlambatan</span>
            <span className={`text-base font-extrabold ${alertCount > 0 ? "text-red-700" : "text-[#131b2e]"}`}>
              {alertCount} Tamu
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor meja (cth: 04), nomor pesanan (#QD-8841), atau nama pelanggan..."
          className="w-full h-10 rounded-xl border border-[#bccac0]/40 bg-white pl-10 pr-4 text-xs text-[#131b2e] placeholder:text-[#6d7a72] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20 transition-all"
        />
      </div>
    </div>
  );
}
