"use client";
// src/features/kds/kds-order-card.tsx
// Kartu pesanan individual untuk KDS Dapur dengan konfirmasi dialog & debouncing

import { useEffect, useState } from "react";
import {
  Clock,
  Flame,
  Sparkles,
  Check,
  PackageOpen,
  PhoneCall,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { KdsOrder } from "@/features/kds/kds-data";

interface Props {
  order: KdsOrder;
  onUpdateStatus: (id: string, next: "cooking" | "ready" | "completed") => void;
  onCheckIn: (id: string) => void;
  onNoShow: (id: string) => void;
}

function useElapsedMinutes(isoTimestamp: string) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const calc = () => {
      const diff = Date.now() - new Date(isoTimestamp).getTime();
      setElapsed(Math.floor(diff / 60_000));
    };
    calc();
    const id = setInterval(calc, 30_000);
    return () => clearInterval(id);
  }, [isoTimestamp]);
  return elapsed;
}

function useArrivalCountdown(arrivalTime: string) {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  useEffect(() => {
    const calc = () => {
      const [h, m] = arrivalTime.split(":").map(Number);
      const now = new Date();
      const arrival = new Date();
      arrival.setHours(h, m, 0, 0);
      const diff = Math.round((arrival.getTime() - now.getTime()) / 60_000);
      setMinutesLeft(diff);
    };
    calc();
    const id = setInterval(calc, 30_000);
    return () => clearInterval(id);
  }, [arrivalTime]);
  return minutesLeft;
}

export function KdsOrderCard({
  order,
  onUpdateStatus,
  onCheckIn,
  onNoShow,
}: Props) {
  const elapsed = useElapsedMinutes(order.orderedAt);
  const minutesLeft = useArrivalCountdown(order.arrivalTime);
  const [activeConfirm, setActiveConfirm] = useState<
    "noshow" | "completed" | "checkin" | null
  >(null);

  const isReceived = order.status === "received";
  const isCooking = order.status === "cooking";
  const isReady = order.status === "ready";

  // Grace period: tamu sudah lewat ETA
  const isLate = minutesLeft !== null && minutesLeft < 0;
  const gracePassed = minutesLeft !== null && minutesLeft < -15;
  const lateMinutes =
    minutesLeft !== null && minutesLeft < 0 ? Math.abs(minutesLeft) : 0;

  const cardBorder = isReady
    ? "border-[#006948] ring-1 ring-[#006948]/40"
    : isCooking
    ? "border-amber-400 ring-1 ring-amber-300"
    : gracePassed
    ? "border-red-400 ring-2 ring-red-300 animate-pulse"
    : isLate
    ? "border-yellow-400"
    : "border-[#bccac0]/50";

  return (
    <>
      <div
        className={`rounded-2xl border bg-white shadow-sm transition-all ${cardBorder}`}
      >
        {/* Grace period alert banner */}
        {isLate && (
          <div
            className={`flex items-center justify-between gap-2 rounded-t-2xl px-4 py-2 text-xs font-semibold ${
              gracePassed
                ? "bg-red-500 text-white"
                : "bg-amber-400 text-amber-950"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {gracePassed
                ? `Lewat Batas Toleransi (+${lateMinutes} menit)`
                : `Tamu Terlambat (+${lateMinutes} menit)`}
            </span>
            {gracePassed && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Ambil Tindakan
              </span>
            )}
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#bccac0]/20 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#006948]">
                  Meja {order.tableNumber}
                </span>
                <Badge
                  variant={
                    isReady ? "success" : isCooking ? "warning" : "default"
                  }
                  className="text-[10px] uppercase"
                >
                  {isReady
                    ? "Siap Saji"
                    : isCooking
                    ? "Sedang Dimasak"
                    : "Pesanan Masuk"}
                </Badge>
              </div>
              <span className="text-xs font-semibold text-[#131b2e]">
                {order.customerName}
              </span>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#6d7a72]">
                <PhoneCall className="h-3 w-3" />
                <span>{order.customerPhone}</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div>
                <span className="text-[10px] text-[#6d7a72] block">
                  Estimasi Tiba
                </span>
                <span
                  className={`text-sm font-extrabold flex items-center gap-1 justify-end ${
                    isLate ? "text-red-600" : "text-[#131b2e]"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {order.arrivalTime}
                </span>
              </div>
              {minutesLeft !== null && (
                <span
                  className={`text-[10px] font-semibold block ${
                    minutesLeft < 0
                      ? "text-red-500"
                      : minutesLeft <= 15
                      ? "text-amber-600"
                      : "text-[#006948]"
                  }`}
                >
                  {minutesLeft < 0
                    ? `Telat ${Math.abs(minutesLeft)} mnt`
                    : minutesLeft === 0
                    ? "Tiba sekarang!"
                    : `${minutesLeft} mnt lagi`}
                </span>
              )}
              <span className="text-[10px] text-[#6d7a72] block">
                +{elapsed} mnt sejak masuk
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 py-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-black text-[#006948]">
                    {item.qty}×
                  </span>
                  <span className="font-semibold text-[#131b2e]">
                    {item.name}
                  </span>
                </div>
                {item.notes && (
                  <p className="mt-1 ml-4 text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded font-medium border-l-2 border-amber-500 flex items-start gap-1.5">
                    <FileText className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
                    <span>{item.notes}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-[#bccac0]/20 pt-3 space-y-2">
            {isReceived && (
              <Button
                type="button"
                onClick={() => onUpdateStatus(order.id, "cooking")}
                className="w-full bg-[#fea619] hover:bg-[#e59516] text-[#2a1700] font-bold text-xs h-10 gap-1.5"
              >
                <Flame className="h-4 w-4" />
                <span>Mulai Masak Sekarang</span>
              </Button>
            )}

            {isCooking && (
              <Button
                type="button"
                onClick={() => onUpdateStatus(order.id, "ready")}
                className="w-full bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Tandai Siap Saji</span>
              </Button>
            )}

            {isReady && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => setActiveConfirm("checkin")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Tamu Tiba</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveConfirm("completed")}
                  variant="outline"
                  className="text-xs h-10 gap-1.5 font-semibold"
                >
                  <Check className="h-4 w-4 text-[#006948]" />
                  <span>Selesai</span>
                </Button>
              </div>
            )}

            {/* No-Show / Grace period action */}
            {isLate && (
              <div
                className={`rounded-xl p-3 space-y-2 ${
                  gracePassed
                    ? "bg-red-50 border border-red-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <p className="text-[11px] font-semibold text-[#131b2e]">
                  {gracePassed
                    ? "Lewat toleransi 15 menit — ambil tindakan:"
                    : "Tamu sudah terlambat:"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setActiveConfirm("noshow")}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-8 font-bold gap-1"
                  >
                    <PackageOpen className="h-3.5 w-3.5" />
                    <span>Bungkus &amp; Lepas Meja</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-8 font-semibold border-amber-400 text-amber-800"
                    onClick={() => {}}
                  >
                    Beri Toleransi Lagi
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={activeConfirm === "noshow"}
        title={`Bungkus & Lepas Meja ${order.tableNumber}?`}
        description={`Tamu ${order.customerName} terlambat melewati batas toleransi. Pesanan akan dikemas takeaway dan Meja ${order.tableNumber} dikembalikan ke status Kosong.`}
        confirmLabel="Ya, Bungkus Makanan"
        variant="danger"
        onConfirm={() => {
          onNoShow(order.id);
          setActiveConfirm(null);
        }}
        onClose={() => setActiveConfirm(null)}
      />

      <ConfirmDialog
        isOpen={activeConfirm === "completed"}
        title={`Tandai Pesanan Meja ${order.tableNumber} Selesai?`}
        description="Pesanan telah disajikan secara lengkap kepada tamu dan akan dihapus dari papan antrean KDS dapur."
        confirmLabel="Ya, Pesanan Selesai"
        variant="primary"
        onConfirm={() => {
          onUpdateStatus(order.id, "completed");
          setActiveConfirm(null);
        }}
        onClose={() => setActiveConfirm(null)}
      />

      <ConfirmDialog
        isOpen={activeConfirm === "checkin"}
        title={`Konfirmasi Tamu Meja ${order.tableNumber} Tiba?`}
        description={`Customer ${order.customerName} telah tiba di restoran. Hidangan siap diserahkan ke meja.`}
        confirmLabel="Ya, Tamu Sudah di Meja"
        variant="primary"
        onConfirm={() => {
          onCheckIn(order.id);
          setActiveConfirm(null);
        }}
        onClose={() => setActiveConfirm(null)}
      />
    </>
  );
}
