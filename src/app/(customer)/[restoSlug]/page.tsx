"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Plus, 
  Minus, 
  Check, 
  Lock, 
  Users,
  ShoppingCart,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants?: { name: string; selected: string }[];
}

const MOCK_RESTO = {
  id: "resto-1",
  name: "Kopi Kenangan Senopati",
  slug: "kopi-kenangan-senopati",
  area: "Senopati, Jakarta Selatan",
  rating: 4.8,
  prepTime: "10-15 mnt",
  tables: [
    { id: "t1", number: "01", capacity: 2, status: "vacant" },
    { id: "t2", number: "02", capacity: 4, status: "vacant" },
    { id: "t3", number: "03", capacity: 2, status: "locked", lockedMinutesLeft: 6 },
    { id: "t4", number: "04", capacity: 4, status: "vacant" },
    { id: "t5", number: "05", capacity: 6, status: "occupied" },
    { id: "t6", number: "06", capacity: 2, status: "reserved" },
  ],
  categories: ["Semua", "Kopi Signature", "Non-Kopi", "Roti & Toast", "Camilan"],
  menus: [
    {
      id: "m1",
      category: "Kopi Signature",
      name: "Kopi Kenangan Mantan",
      price: 19000,
      description: "Espresso premium dengan susu segar dan gula aren asli.",
      imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m2",
      category: "Kopi Signature",
      name: "Avocado Coffee",
      price: 28000,
      description: "Kombinasi alpukat kental, espresso shot, dan es krim coklat.",
      imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m3",
      category: "Roti & Toast",
      name: "Roti Coklat Klasik",
      price: 12000,
      description: "Roti empuk bertabur coklat leleh khas Kenangan.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m4",
      category: "Non-Kopi",
      name: "Matcha Latte",
      price: 24000,
      description: "Bubuk matcha Jepang murni dengan susu segar creamy.",
      imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80",
    },
  ],
};

export default function RestoCatalogPage({
  params,
}: {
  params: Promise<{ restoSlug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [selectedTableId, setSelectedTableId] = useState<string>("t4"); // Default Meja 04 from Stitch mockup
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<Record<string, CartItem>>({
    m1: { id: "m1", name: "Kopi Kenangan Mantan", price: 19000, quantity: 1 },
    m3: { id: "m3", name: "Roti Coklat Klasik", price: 12000, quantity: 1 },
  });

  const selectedTable = MOCK_RESTO.tables.find((t) => t.id === selectedTableId);
  const cartItems = Object.values(cart).filter((item) => item.quantity > 0);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleAddToCart = (menu: (typeof MOCK_RESTO.menus)[0]) => {
    setCart((prev) => ({
      ...prev,
      [menu.id]: {
        id: menu.id,
        name: menu.name,
        price: menu.price,
        quantity: (prev[menu.id]?.quantity || 0) + 1,
      },
    }));
  };

  const handleUpdateQuantity = (menuId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[menuId];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[menuId];
        return copy;
      }
      return {
        ...prev,
        [menuId]: { ...current, quantity: newQty },
      };
    });
  };

  const handleProceedCheckout = () => {
    if (!selectedTableId) {
      toast.error("Silakan pilih meja terlebih dahulu.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Keranjang belanja masih kosong.");
      return;
    }

    // Save cart & table to session/localStorage for checkout
    if (typeof window !== "undefined") {
      sessionStorage.setItem("quickdine_selected_table", selectedTableId);
      sessionStorage.setItem("quickdine_cart", JSON.stringify(cartItems));
    }

    router.push(`/${resolvedParams.restoSlug}/checkout`);
  };

  const filteredMenus =
    selectedCategory === "Semua"
      ? MOCK_RESTO.menus
      : MOCK_RESTO.menus.filter((m) => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#bccac0]/30 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-[#131b2e] hover:text-[#006948]">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-bold text-[#131b2e] line-clamp-1">{MOCK_RESTO.name}</h1>
          <p className="text-[11px] text-[#6d7a72]">{MOCK_RESTO.area}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#006948]">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{MOCK_RESTO.rating}</span>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-5 space-y-6">
        {/* Table Map Section */}
        <section className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#131b2e] flex items-center gap-1.5">
              <span>Denah Meja Resto</span>
              <span className="text-[11px] font-normal text-[#6d7a72]">(Pilih 1 meja)</span>
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-[#6d7a72]">
              <Clock className="h-3 w-3 text-[#006948]" />
              <span>Prep: ~{MOCK_RESTO.prepTime}</span>
            </div>
          </div>

          {/* Table Legend */}
          <div className="flex items-center gap-3 text-[11px] text-[#6d7a72] pt-1 border-t border-[#bccac0]/20">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm border border-emerald-500 bg-white" />
              Kosong
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
              Sedang Dipesan
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
              Tidak Tersedia
            </span>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {MOCK_RESTO.tables.map((table) => {
              const isSelected = selectedTableId === table.id;
              const isVacant = table.status === "vacant";
              const isLocked = table.status === "locked";
              const isUnavailable = table.status === "reserved" || table.status === "occupied";

              if (isUnavailable) {
                return (
                  <div
                    key={table.id}
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-3 opacity-60 cursor-not-allowed"
                  >
                    <span className="text-xs font-bold text-slate-500">Meja {table.number}</span>
                    <span className="text-[10px] text-slate-400">{table.capacity} Kursi</span>
                    <span className="mt-1 text-[9px] font-medium text-slate-500">Terisi</span>
                  </div>
                );
              }

              if (isLocked) {
                return (
                  <div
                    key={table.id}
                    className="flex flex-col items-center justify-center rounded-xl border border-amber-300 bg-amber-50 p-3 cursor-not-allowed text-amber-800"
                  >
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-amber-600" />
                      <span className="text-xs font-bold">Meja {table.number}</span>
                    </div>
                    <span className="text-[10px] text-amber-700">{table.capacity} Kursi</span>
                    <span className="mt-1 text-[9px] font-semibold text-amber-700">
                      Terkunci ~{table.lockedMinutesLeft}m
                    </span>
                  </div>
                );
              }

              // Vacant / Selectable Table
              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => setSelectedTableId(table.id)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                    isSelected
                      ? "border-[#006948] bg-emerald-50 text-[#006948] ring-2 ring-[#006948]"
                      : "border-[#bccac0]/60 bg-white text-[#131b2e] hover:border-[#006948] shadow-2xs"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#006948] text-white">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                  <span className="text-xs font-bold">Meja {table.number}</span>
                  <span className="text-[10px] text-[#6d7a72]">{table.capacity} Kursi</span>
                  <span className="mt-1 text-[9px] font-medium text-emerald-700">Tersedia</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Menu Category Tabs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MOCK_RESTO.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[#006948] text-white shadow-2xs"
                    : "bg-white text-[#131b2e] border border-[#bccac0]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="space-y-3">
            {filteredMenus.map((menu) => {
              const inCart = cart[menu.id]?.quantity || 0;

              return (
                <div
                  key={menu.id}
                  className="flex gap-3.5 rounded-2xl border border-[#bccac0]/30 bg-white p-3.5 shadow-2xs"
                >
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    className="h-20 w-20 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#131b2e]">{menu.name}</h3>
                      <p className="text-[11px] text-[#6d7a72] line-clamp-2 mt-0.5">{menu.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-[#006948]">
                        {formatRupiah(menu.price)}
                      </span>

                      {inCart > 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-1 border border-emerald-200">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(menu.id, -1)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-white text-[#006948] shadow-2xs"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-[#006948] min-w-[14px] text-center">
                            {inCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(menu.id, 1)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-[#006948] text-white shadow-2xs"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(menu)}
                          className="h-7 px-3 text-[11px] rounded-lg bg-[#006948] hover:bg-[#005137] text-white"
                        >
                          Tambah
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Checkout Bar (From Stitch Screen 2) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#bccac0]/30 bg-white/95 p-3.5 backdrop-blur-md shadow-lg">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#131b2e]">
                <span>Meja {selectedTable?.number || "-"}</span>
                <span>•</span>
                <span>{totalCartCount} Menu</span>
              </div>
              <p className="text-sm font-extrabold text-[#006948]">{formatRupiah(subtotal)}</p>
            </div>

            <Button
              onClick={handleProceedCheckout}
              className="rounded-xl bg-[#006948] hover:bg-[#005137] text-white px-5 font-semibold text-xs h-11 gap-1.5"
            >
              <span>Lanjut Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
