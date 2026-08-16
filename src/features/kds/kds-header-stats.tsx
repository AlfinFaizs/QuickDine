"use client";
// src/features/kds/kds-header-stats.tsx
// Bar statistik header KDS

import { ChefHat, Clock, CheckCircle2, Bell } from "lucide-react";
import type { KdsOrder } from "@/features/kds/kds-data";

interface Props {
  orders: KdsOrder[];
}

export function KdsHeaderStats({ orders }: Props) {
  const received = orders.filter((o) => o.status === "received").length;
  const cooking = orders.filter((o) => o.status === "cooking").length;
  const ready = orders.filter((o) => o.status === "ready").length;
  const total = orders.length;

  const stats = [
    {
      label: "Menunggu Masak",
      value: received,
      icon: Bell,
      bg: "bg-slate-50 border-slate-200",
      text: "text-slate-700",
      iconColor: "text-slate-500",
    },
    {
      label: "Sedang Dimasak",
      value: cooking,
      icon: ChefHat,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      iconColor: "text-amber-500",
    },
    {
      label: "Siap Disajikan",
      value: ready,
      icon: CheckCircle2,
      bg: "bg-[#006948]/5 border-[#006948]/20",
      text: "text-[#006948]",
      iconColor: "text-[#006948]",
    },
    {
      label: "Total Pesanan Aktif",
      value: total,
      icon: Clock,
      bg: "bg-white border-[#bccac0]/40",
      text: "text-[#131b2e]",
      iconColor: "text-[#131b2e]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className={`flex items-center gap-3 rounded-xl border p-3 ${s.bg}`}
          >
            <div className={`rounded-lg bg-white/60 p-2 ${s.iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold leading-none ${s.text}`}>
                {s.value}
              </p>
              <p className="text-[10px] text-[#6d7a72] mt-0.5 leading-tight">
                {s.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
