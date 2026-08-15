"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Table2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { useCartStore } from "./cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FloatingCartBarProps {
  restaurantSlug: string;
}

export function FloatingCartBar({ restaurantSlug }: FloatingCartBarProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const selectedTable = useCartStore((state) => state.selectedTable);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subtotal = useCartStore((state) => state.getSubtotal());

  if (items.length === 0) return null;

  const handleProceed = () => {
    if (!selectedTable) {
      toast.error("Silakan pilih meja Anda di bagian denah meja terlebih dahulu!");
      // Scroll to table map
      const el = document.getElementById("table-map-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push(`/${restaurantSlug}/checkout`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <div className="mx-auto max-w-3xl pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#131b2e] p-3.5 sm:p-4 text-white shadow-2xl border border-white/10 backdrop-blur-md">
          {/* Left Info: Table & Item Count */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#006948] text-white">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#fea619] text-[10px] font-black text-black">
                {totalItems}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {formatRupiah(subtotal)}
                </span>
                <span className="text-[11px] text-slate-400">
                  ({totalItems} menu)
                </span>
              </div>

              {selectedTable ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <Table2 className="h-3 w-3" />
                  <span>Meja {selectedTable.number} ({selectedTable.capacity} Kursi)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  <span>Pilih meja sebelum bayar</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Action Button */}
          <Button
            type="button"
            onClick={handleProceed}
            className="w-full sm:w-auto h-11 bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs px-5 gap-2 shadow-lg"
          >
            <span>Lanjut ke Pembayaran</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
