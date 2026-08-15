"use client";

import Link from "next/link";
import { ArrowLeft, Clock, UtensilsCrossed, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

const MOCK_MY_ORDERS = [
  {
    id: "ord-101",
    restaurantName: "Kopi Kenangan Senopati",
    restoSlug: "kopi-kenangan-senopati",
    tableNumber: "04",
    totalAmount: 32500,
    itemsCount: 2,
    orderStatus: "cooking",
    arrivalTime: "12:30 WIB",
    date: "Hari ini",
  },
  {
    id: "ord-98",
    restaurantName: "Bakmi GM Grand Indonesia",
    restoSlug: "bakmi-gm-gi",
    tableNumber: "12",
    totalAmount: 85000,
    itemsCount: 3,
    orderStatus: "completed",
    arrivalTime: "19:00 WIB",
    date: "Kemarin",
  },
];

export default function PesananSayaPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#bccac0]/30 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-[#131b2e]">
          <ArrowLeft className="h-4 w-4" />
          <span>Ke Beranda</span>
        </Link>
        <h1 className="text-sm font-bold text-[#131b2e]">Riwayat Pesanan Saya</h1>
        <div className="w-12" />
      </header>

      <div className="mx-auto max-w-lg px-4 py-5 space-y-4">
        {MOCK_MY_ORDERS.map((order) => {
          const isCooking = order.orderStatus === "cooking";

          return (
            <Link
              key={order.id}
              href={`/${order.restoSlug}/order/${order.id}`}
              className="block rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-2xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-[#6d7a72]">{order.date} • Jam Tiba {order.arrivalTime}</span>
                  <h3 className="text-sm font-bold text-[#131b2e]">{order.restaurantName}</h3>
                  <span className="text-xs text-[#006948] font-medium">Meja {order.tableNumber}</span>
                </div>

                {isCooking ? (
                  <Badge variant="warning" className="animate-pulse">
                    Sedang Dimasak
                  </Badge>
                ) : (
                  <Badge variant="success">
                    Selesai
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#bccac0]/20 pt-2.5 text-xs">
                <span className="text-[#6d7a72]">{order.itemsCount} Menu Dipesan</span>
                <div className="flex items-center gap-1 font-bold text-[#006948]">
                  <span>{formatRupiah(order.totalAmount)}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
