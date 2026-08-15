"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  INITIAL_KDS_ORDERS, 
  KdsOrder, 
  KdsOrderStatus 
} from "@/features/kds/kds-data";
import { KdsOrderCard } from "@/features/kds/kds-order-card";
import { KdsHeaderStats } from "@/features/kds/kds-header-stats";

type TabFilter = "all" | "received" | "cooking" | "ready" | "alerts" | "history";

const TAB_OPTIONS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "Semua Pesanan" },
  { key: "received", label: "Perlu Dimasak" },
  { key: "cooking", label: "Sedang Dimasak" },
  { key: "ready", label: "Siap Saji" },
  { key: "alerts", label: "Peringatan Terlambat" },
  { key: "history", label: "Riwayat Selesai" },
];

export default function KdsPage() {
  const [orders, setOrders] = useState<KdsOrder[]>(INITIAL_KDS_ORDERS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Status transitions
  const handleUpdateStatus = (orderId: string, nextStatus: KdsOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: nextStatus,
          isCookAlarmTriggered: nextStatus === "received",
        };
      })
    );

    if (nextStatus === "cooking") {
      toast.success("Pesanan mulai dimasak! Estimasi hidangan siap tepat waktu.");
    } else if (nextStatus === "ready") {
      toast.success("Hidangan selesai dimasak dan telah siap di meja!");
    } else if (nextStatus === "completed") {
      toast.success("Pesanan diselesaikan. Meja dapat dibersihkan.");
    }
  };

  // Guest checked in / arrived
  const handleGuestArrived = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          arrivalStatus: "arrived",
          lateMinutes: 0,
        };
      })
    );
    toast.success("Tamu telah tiba dan duduk di meja. Timer keterlambatan dinonaktifkan.");
  };

  // Trigger No-Show (convert to Takeaway & Free table)
  const handleTriggerNoShow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "converted_takeaway",
          arrivalStatus: "tolerance_exceeded",
        };
      })
    );
    toast.warning("Pesanan dibungkus (Takeaway). Meja telah dikosongkan untuk tamu walk-in.");
  };

  // Extend tolerance (+10 minutes)
  const handleExtendTolerance = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          arrivalStatus: "late_grace",
        };
      })
    );
    toast.info("Toleransi kedatangan tamu diperpanjang 10 menit.");
  };

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      order.tableNumber.toLowerCase().includes(q) ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.items.some((it) => it.name.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // Tab filter
    if (activeTab === "all") {
      return order.status !== "completed";
    }
    if (activeTab === "received") {
      return order.status === "received";
    }
    if (activeTab === "cooking") {
      return order.status === "cooking";
    }
    if (activeTab === "ready") {
      return order.status === "ready";
    }
    if (activeTab === "alerts") {
      return (
        order.arrivalStatus === "late_grace" ||
        order.arrivalStatus === "tolerance_exceeded"
      );
    }
    if (activeTab === "history") {
      return (
        order.status === "completed" ||
        order.status === "converted_takeaway"
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Live Metric Counters */}
      <KdsHeaderStats
        orders={orders}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tab Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#bccac0]/30">
        {TAB_OPTIONS.map((tab) => {
          const isActive = activeTab === tab.key;
          let count = 0;
          if (tab.key === "all") count = orders.filter((o) => o.status !== "completed").length;
          if (tab.key === "received") count = orders.filter((o) => o.status === "received").length;
          if (tab.key === "cooking") count = orders.filter((o) => o.status === "cooking").length;
          if (tab.key === "ready") count = orders.filter((o) => o.status === "ready").length;
          if (tab.key === "alerts") {
            count = orders.filter(
              (o) => o.arrivalStatus === "late_grace" || o.arrivalStatus === "tolerance_exceeded"
            ).length;
          }
          if (tab.key === "history") {
            count = orders.filter(
              (o) => o.status === "completed" || o.status === "converted_takeaway"
            ).length;
          }

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                isActive
                  ? "bg-[#006948] text-white shadow-2xs"
                  : "bg-transparent text-[#6d7a72] hover:bg-[#f2f3ff] hover:text-[#131b2e]"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? "bg-white/20 text-white" : "bg-slate-200 text-[#131b2e]"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Grid Display */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#bccac0]/60 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            🍳
          </div>
          <h3 className="text-sm font-bold text-[#131b2e]">Tidak ada antrean pesanan pada filter ini</h3>
          <p className="text-xs text-[#6d7a72] max-w-sm mt-1">
            Pesanan baru dari customer yang telah menyelesaikan pembayaran akan muncul secara otomatis di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <KdsOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              onGuestArrived={handleGuestArrived}
              onTriggerNoShow={handleTriggerNoShow}
              onExtendTolerance={handleExtendTolerance}
            />
          ))}
        </div>
      )}
    </div>
  );
}
