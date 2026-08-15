"use client";

import { useState } from "react";
import { ChefHat, Clock, Check, AlertTriangle, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface KdsOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  arrivalTime: string;
  status: "received" | "cooking" | "ready";
  items: Array<{ name: string; qty: number; notes?: string }>;
  cookTriggerInMinutes: number;
}

const INITIAL_ORDERS: KdsOrder[] = [
  {
    id: "ord-1",
    tableNumber: "04",
    customerName: "Alfin Faiz",
    arrivalTime: "12:30 WIB",
    status: "cooking",
    cookTriggerInMinutes: 5,
    items: [
      { name: "Kopi Kenangan Mantan", qty: 2, notes: "Less Sugar, Ice Normal" },
      { name: "Roti Coklat Klasik", qty: 1 },
    ],
  },
  {
    id: "ord-2",
    tableNumber: "02",
    customerName: "Budi Santoso",
    arrivalTime: "12:45 WIB",
    status: "received",
    cookTriggerInMinutes: 20,
    items: [
      { name: "Avocado Coffee", qty: 1, notes: "Extra Shot Espresso" },
      { name: "Matcha Latte", qty: 2 },
    ],
  },
];

export default function KdsPage() {
  const [orders, setOrders] = useState<KdsOrder[]>(INITIAL_ORDERS);

  const handleUpdateStatus = (orderId: string, nextStatus: "cooking" | "ready" | "completed") => {
    if (nextStatus === "completed") {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Pesanan diselesaikan!");
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    toast.success(`Status pesanan diperbarui menjadi ${nextStatus}`);
  };

  const handleTriggerNoShow = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast.warning("Pesanan dikonversi ke Takeaway (No-Show). Meja dikembalikan ke Kosong.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-[#006948]" />
            <span>Kitchen Display System (KDS)</span>
          </h1>
          <p className="text-xs text-[#6d7a72]">
            Antrean pesanan aktif dapur real-time. Pesanan baru akan berbunyi otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning">{orders.filter((o) => o.status === "received").length} Menunggu Masak</Badge>
          <Badge variant="success">{orders.filter((o) => o.status === "cooking").length} Sedang Dimasak</Badge>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.map((order) => {
          const isReceived = order.status === "received";
          const isCooking = order.status === "cooking";

          return (
            <div
              key={order.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm space-y-4 transition-all ${
                isCooking ? "border-amber-400 ring-1 ring-amber-300" : "border-[#bccac0]/50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#bccac0]/20 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#006948]">Meja {order.tableNumber}</span>
                    <Badge variant={isCooking ? "warning" : "default"}>
                      {isCooking ? "Sedang Dimasak" : "Pesanan Masuk"}
                    </Badge>
                  </div>
                  <span className="text-xs font-semibold text-[#131b2e]">{order.customerName}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#6d7a72] block">Estimasi Tiba</span>
                  <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#006948]" />
                    {order.arrivalTime}
                  </span>
                </div>
              </div>

              {/* Menu Item List */}
              <div className="space-y-2 py-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#131b2e]">{item.qty}x </span>
                      <span className="font-semibold text-[#131b2e]">{item.name}</span>
                      {item.notes && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 font-medium">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[#bccac0]/20 pt-3 space-y-2">
                {isReceived && (
                  <Button
                    onClick={() => handleUpdateStatus(order.id, "cooking")}
                    className="w-full bg-[#fea619] hover:bg-[#e59516] text-[#2a1700] font-bold text-xs h-10 gap-1.5"
                  >
                    <Flame className="h-4 w-4" />
                    <span>Mulai Masak</span>
                  </Button>
                )}

                {isCooking && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleUpdateStatus(order.id, "ready")}
                      className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 gap-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Siap Saji</span>
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(order.id, "completed")}
                      variant="outline"
                      className="text-xs h-10 gap-1 font-semibold"
                    >
                      <Check className="h-4 w-4 text-[#006948]" />
                      <span>Selesai</span>
                    </Button>
                  </div>
                )}

                {/* No-Show Trigger Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerNoShow(order.id)}
                  className="w-full text-center text-[10px] text-red-600 hover:underline pt-1"
                >
                  Tamu Terlambat &gt;15 Mnt? Trigger No-Show (Ubah Takeaway)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
