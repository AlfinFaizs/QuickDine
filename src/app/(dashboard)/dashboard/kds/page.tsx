"use client";

import { useState } from "react";
import { ChefHat, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { KdsOrderCard } from "@/features/kds/kds-order-card";
import { KdsHeaderStats } from "@/features/kds/kds-header-stats";
import { INITIAL_KDS_ORDERS, type KdsOrder } from "@/features/kds/kds-data";

export default function KdsPage() {
  const [orders, setOrders] = useState<KdsOrder[]>(INITIAL_KDS_ORDERS);
  const [filterStatus, setFilterStatus] = useState<"all" | KdsOrder["status"]>("all");

  const handleUpdateStatus = (
    orderId: string,
    next: "cooking" | "ready" | "completed"
  ) => {
    if (next === "completed") {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Pesanan selesai dan dihapus dari antrean KDS.");
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
    );
    const label = next === "cooking" ? "Mulai Masak" : "Siap Saji";
    toast.success(`Status pesanan diperbarui: ${label}`);
  };

  const handleCheckIn = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast.success("Tamu tiba. Pesanan diserahkan ke meja (Status: OCCUPIED).");
  };

  const handleNoShow = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast.warning(
      "No-Show: Pesanan dikemas takeaway. Meja dikembalikan ke status VACANT."
    );
  };

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const filterOptions: { key: "all" | KdsOrder["status"]; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "received", label: "Menunggu Masak" },
    { key: "cooking", label: "Sedang Dimasak" },
    { key: "ready", label: "Siap Saji" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-[#006948]" />
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs text-[#6d7a72] mt-0.5">
            Antrean pesanan aktif dapur secara real-time. Alarm masak &amp; grace period tamu otomatis terhitung.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOrders(INITIAL_KDS_ORDERS)}
          className="gap-1.5 text-xs h-9 shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Demo
        </Button>
      </div>

      {/* Stats Bar */}
      <KdsHeaderStats orders={orders} />

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
            {opt.key !== "all" && (
              <span className="ml-1.5 opacity-70">
                ({orders.filter((o) => o.status === opt.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <ChefHat className="h-12 w-12 text-[#bccac0]" />
          <p className="text-sm font-semibold text-[#131b2e]">
            {filterStatus === "all"
              ? "Tidak ada pesanan aktif saat ini."
              : "Tidak ada pesanan dengan status ini."}
          </p>
          <p className="text-xs text-[#6d7a72]">
            Pesanan baru dari customer akan muncul otomatis di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((order) => (
            <KdsOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              onCheckIn={handleCheckIn}
              onNoShow={handleNoShow}
            />
          ))}
        </div>
      )}
    </div>
  );
}
