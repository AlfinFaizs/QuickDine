"use client";

import { 
  X, 
  Users, 
  Clock, 
  Phone, 
  Utensils, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardTable, TableStatus } from "./tables-data";

interface TableDetailModalProps {
  table: DashboardTable | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (tableId: string, status: TableStatus) => void;
}

export function TableDetailModal({
  table,
  isOpen,
  onClose,
  onStatusChange,
}: TableDetailModalProps) {
  if (!isOpen || !table) return null;

  const isVacant = table.status === "vacant";
  const isLocked = table.status === "locked";
  const isReserved = table.status === "reserved";
  const isOccupied = table.status === "occupied";
  const order = table.activeOrder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#bccac0]/40 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#bccac0]/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#131b2e]">
                Meja {table.number}
              </h3>
              <Badge
                variant={
                  isVacant
                    ? "success"
                    : isLocked
                    ? "warning"
                    : isReserved
                    ? "default"
                    : "secondary"
                }
                className="text-[10px] uppercase font-bold"
              >
                {table.status}
              </Badge>
            </div>
            <p className="text-xs text-[#6d7a72] mt-0.5">
              Area: <strong className="text-[#131b2e]">{table.area}</strong> • Kapasitas: <strong className="text-[#131b2e]">{table.capacity} Orang</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#6d7a72] hover:bg-slate-100 hover:text-[#131b2e]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {order ? (
          <div className="space-y-4 text-xs">
            {/* Customer Contact Card */}
            <div className="rounded-xl bg-[#faf8ff] p-3.5 border border-[#bccac0]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6d7a72]">Nama Pelanggan:</span>
                <span className="font-bold text-[#131b2e]">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d7a72]">No. Pesanan:</span>
                <span className="font-mono font-bold text-[#006948]">#{order.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d7a72]">Estimasi Jam Tiba:</span>
                <span className="font-bold text-[#131b2e] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#006948]" />
                  {order.arrivalTime}
                </span>
              </div>
              {order.customerPhone !== "-" && (
                <div className="flex items-center justify-between pt-1 border-t border-[#bccac0]/20">
                  <span className="text-[#6d7a72]">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#006948] hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    {order.customerPhone}
                  </a>
                </div>
              )}
            </div>

            {/* Ordered Items Summary */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#131b2e] flex items-center gap-1.5">
                <Utensils className="h-4 w-4 text-[#006948]" />
                <span>Rincian Menu ({order.items.length} Item)</span>
              </h4>

              <div className="rounded-xl border border-[#bccac0]/30 divide-y divide-[#bccac0]/20 overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                    <div>
                      <span className="font-bold text-[#131b2e]">{item.qty}x </span>
                      <span className="text-[#131b2e] font-semibold">{item.name}</span>
                      {item.variant && (
                        <p className="text-[11px] text-[#6d7a72] mt-0.5">Opsi: {item.variant}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Billing */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
              <span className="font-medium">Total Pembayaran ({order.paymentMethod}):</span>
              <span className="font-black text-sm text-[#006948]">
                Rp {order.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-6 text-center border border-dashed border-[#bccac0]/50 space-y-1">
            <span className="text-sm font-bold text-[#131b2e]">Meja Tidak Memiliki Pesanan Aktif</span>
            <p className="text-xs text-[#6d7a72]">
              Meja ini sedang kosong dan siap digunakan untuk pemesanan baru.
            </p>
          </div>
        )}

        {/* Status Override Buttons */}
        <div className="border-t border-[#bccac0]/20 pt-4 space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a72] block">
            Override Status Meja Manual:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button
              size="sm"
              variant={isVacant ? "default" : "outline"}
              onClick={() => {
                onStatusChange(table.id, "vacant");
                onClose();
              }}
              className={`text-xs h-9 ${isVacant ? "bg-[#006948]" : ""}`}
            >
              Set Kosong (Vacant)
            </Button>
            <Button
              size="sm"
              variant={isOccupied ? "default" : "outline"}
              onClick={() => {
                onStatusChange(table.id, "occupied");
                onClose();
              }}
              className="text-xs h-9"
            >
              Set Terisi (Occupied)
            </Button>
            <Button
              size="sm"
              variant={table.status === "maintenance" ? "destructive" : "outline"}
              onClick={() => {
                onStatusChange(table.id, "maintenance");
                onClose();
              }}
              className="text-xs h-9 text-slate-700"
            >
              Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
