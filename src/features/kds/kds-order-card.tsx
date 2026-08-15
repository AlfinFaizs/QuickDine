"use client";

import { 
  Flame, 
  Clock, 
  Sparkles, 
  Check, 
  UserCheck, 
  PackageCheck, 
  AlertCircle, 
  Phone, 
  Users,
  Timer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KdsOrder, KdsOrderStatus } from "./kds-data";

interface KdsOrderCardProps {
  order: KdsOrder;
  onUpdateStatus: (orderId: string, nextStatus: KdsOrderStatus) => void;
  onGuestArrived: (orderId: string) => void;
  onTriggerNoShow: (orderId: string) => void;
  onExtendTolerance: (orderId: string) => void;
}

export function KdsOrderCard({
  order,
  onUpdateStatus,
  onGuestArrived,
  onTriggerNoShow,
  onExtendTolerance,
}: KdsOrderCardProps) {
  const isReceived = order.status === "received";
  const isCooking = order.status === "cooking";
  const isReady = order.status === "ready";
  const isCompleted = order.status === "completed";
  const isTakeaway = order.status === "converted_takeaway";

  const isLateGrace = order.arrivalStatus === "late_grace";
  const isToleranceExceeded = order.arrivalStatus === "tolerance_exceeded";
  const isGuestArrived = order.arrivalStatus === "arrived";

  return (
    <div
      className={`rounded-2xl border bg-white shadow-2xs flex flex-col justify-between overflow-hidden transition-all duration-200 ${
        isToleranceExceeded
          ? "border-red-500 ring-2 ring-red-400/50 shadow-md"
          : isLateGrace
          ? "border-amber-400 ring-1 ring-amber-300 shadow-sm"
          : isCooking
          ? "border-[#fea619] shadow-sm"
          : isReady
          ? "border-[#006948] bg-emerald-50/10"
          : "border-[#bccac0]/50"
      }`}
    >
      {/* ── Top Warning Banners ── */}
      {isToleranceExceeded && (
        <div className="bg-red-600 px-4 py-2 text-white flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>LEWAT BATAS TOLERANSI (+{order.lateMinutes} mnt)</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            No-Show Alert
          </span>
        </div>
      )}

      {isLateGrace && (
        <div className="bg-amber-500 px-4 py-1.5 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <Timer className="h-4 w-4 shrink-0" />
            <span>Tamu Terlambat (+{order.lateMinutes} menit)</span>
          </div>
          <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-medium">
            Grace Period 15m
          </span>
        </div>
      )}

      {order.isCookAlarmTriggered && isReceived && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <Flame className="h-4 w-4 animate-bounce shrink-0" />
            <span>Waktunya Masak! (Tiba {order.arrivalMinutesRemaining} mnt lagi)</span>
          </div>
          <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-medium">
            Cook Trigger
          </span>
        </div>
      )}

      {/* ── Card Content ── */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Header Table & Customer Info */}
        <div className="flex items-start justify-between border-b border-[#bccac0]/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#006948]">Meja {order.tableNumber}</span>
              <span className="text-xs font-mono font-bold text-[#6d7a72]">#{order.orderNumber}</span>
              {isGuestArrived && (
                <Badge variant="success" className="text-[10px] gap-1">
                  <UserCheck className="h-3 w-3" />
                  Tamu Duduk
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#131b2e]">{order.customerName}</span>
              <span className="text-[11px] text-[#6d7a72] flex items-center gap-0.5">
                <Users className="h-3 w-3" /> {order.guestCount}pax
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1 text-xs font-bold text-[#131b2e]">
              <Clock className="h-3.5 w-3.5 text-[#006948]" />
              <span>{order.arrivalTime}</span>
            </div>
            <span className="text-[10px] text-[#6d7a72] block">Pesan {order.orderedAt}</span>
          </div>
        </div>

        {/* Status Badge Line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#6d7a72]">Status Dapur:</span>
            <Badge
              variant={
                isReceived
                  ? "warning"
                  : isCooking
                  ? "default"
                  : isReady
                  ? "success"
                  : "secondary"
              }
              className="text-[10px] uppercase font-bold"
            >
              {isReceived && "Perlu Dimasak"}
              {isCooking && "Sedang Dimasak"}
              {isReady && "Siap Saji di Meja"}
              {isCompleted && "Selesai"}
              {isTakeaway && "Takeaway (No-Show)"}
            </Badge>
          </div>
          <span className="text-[11px] font-semibold text-[#006948]">
            {order.paymentMethod} • Rp {order.totalAmount.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Menu Items List */}
        <div className="space-y-2.5 pt-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-[#faf8ff] p-2.5 border border-[#bccac0]/30 space-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#006948] text-[11px] font-bold text-white">
                    {item.qty}
                  </span>
                  <span className="text-xs font-bold text-[#131b2e]">{item.name}</span>
                </div>
              </div>

              {item.variant && (
                <p className="text-[11px] text-[#6d7a72] pl-7">
                  <span className="font-semibold text-[#131b2e]">Opsi:</span> {item.variant}
                </p>
              )}

              {item.notes && (
                <div className="ml-7 rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-[11px] font-medium text-amber-900">
                  ⚡ <strong>Catatan:</strong> {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Actions ── */}
      <div className="border-t border-[#bccac0]/20 bg-slate-50/70 p-3 sm:p-4 space-y-2">
        {/* Special No-Show Controls when Tolerance Exceeded */}
        {isToleranceExceeded && (
          <div className="space-y-2">
            <Button
              onClick={() => onTriggerNoShow(order.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs h-10 gap-1.5 shadow-sm"
            >
              <PackageCheck className="h-4 w-4" />
              <span>Bungkus (Takeaway) &amp; Kosongkan Meja</span>
            </Button>
            <Button
              onClick={() => onExtendTolerance(order.id)}
              variant="outline"
              className="w-full text-xs h-8 border-slate-300 text-[#131b2e] hover:bg-slate-100"
            >
              <span>+ Beri Toleransi Tambahan (10 Menit)</span>
            </Button>
          </div>
        )}

        {/* Regular Kitchen Workflow Actions */}
        {!isToleranceExceeded && (
          <div className="space-y-2">
            {isReceived && (
              <Button
                onClick={() => onUpdateStatus(order.id, "cooking")}
                className="w-full bg-[#fea619] hover:bg-[#e59516] text-[#2a1700] font-bold text-xs h-10 gap-1.5 shadow-2xs"
              >
                <Flame className="h-4 w-4" />
                <span>Mulai Masak Sekarang</span>
              </Button>
            )}

            {isCooking && (
              <Button
                onClick={() => onUpdateStatus(order.id, "ready")}
                className="w-full bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 gap-1.5 shadow-2xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Selesai Masak &amp; Siap Saji</span>
              </Button>
            )}

            {isReady && (
              <div className="grid grid-cols-2 gap-2">
                {!isGuestArrived ? (
                  <Button
                    onClick={() => onGuestArrived(order.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 gap-1"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Tamu Tiba</span>
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold text-xs h-10 gap-1"
                  >
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <span>Sudah Duduk</span>
                  </Button>
                )}

                <Button
                  onClick={() => onUpdateStatus(order.id, "completed")}
                  className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 gap-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Selesai Santap</span>
                </Button>
              </div>
            )}

            {/* Quick action link to contact customer */}
            <div className="flex items-center justify-between text-[11px] text-[#6d7a72] pt-1">
              <a
                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#006948] hover:underline font-medium"
              >
                <Phone className="h-3 w-3" />
                <span>WhatsApp: {order.customerPhone}</span>
              </a>

              {isReady && !isGuestArrived && (
                <button
                  type="button"
                  onClick={() => onTriggerNoShow(order.id)}
                  className="text-red-600 hover:underline font-medium text-[10px]"
                >
                  Trigger No-Show
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
