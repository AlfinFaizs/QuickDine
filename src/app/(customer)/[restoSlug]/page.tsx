"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Plus, 
  Flame,
  Check, 
  Table2, 
  ShoppingBag,
  Sparkles,
  Info,
  Images
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { getRestaurantDetail, MenuItemDetail } from "@/features/restaurants/restaurant-details-data";
import { TableMap } from "@/features/restaurants/table-map";
import { MenuVariantModal } from "@/features/restaurants/menu-variant-modal";
import { FloatingCartBar } from "@/features/orders/floating-cart-bar";
import { useCartStore, SelectedVariant } from "@/features/orders/cart-store";
import { toast } from "sonner";

interface RestoPageProps {
  params: Promise<{ restoSlug: string }>;
}

export default function RestoDetailPage({ params }: RestoPageProps) {
  const { restoSlug } = use(params);
  const resto = getRestaurantDetail(restoSlug);

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeModalItem, setActiveModalItem] = useState<MenuItemDetail | null>(null);

  // Zustand Store
  const setRestaurant = useCartStore((state) => state.setRestaurant);
  const selectedTable = useCartStore((state) => state.selectedTable);
  const selectTable = useCartStore((state) => state.selectTable);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  // Sync current restaurant to cart store
  useEffect(() => {
    setRestaurant(resto.slug, resto.name);
  }, [resto.slug, resto.name, setRestaurant]);

  const filteredMenus = resto.menus.filter((menu) => {
    if (selectedCategory === "Semua") return true;
    return menu.category === selectedCategory;
  });

  const handleAddToCart = (
    item: MenuItemDetail,
    quantity: number,
    variants: SelectedVariant[],
    notes: string,
    unitPrice: number
  ) => {
    addItem({
      menuId: item.id,
      name: item.name,
      basePrice: item.price,
      unitPrice: unitPrice,
      quantity: quantity,
      imageUrl: item.imageUrl,
      selectedVariants: variants,
      notes: notes,
    });
    toast.success(`${quantity}x ${item.name} ditambahkan ke keranjang`, {
      id: `cart-add-${item.id}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-32">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#bccac0]/30 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#131b2e] hover:text-[#006948] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Direktori</span>
        </Link>
        <span className="text-xs font-bold text-[#006948] truncate max-w-[200px]">
          {resto.name}
        </span>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Resto Hero Header */}
        <div className="overflow-hidden rounded-3xl border border-[#bccac0]/40 bg-white shadow-xs">
          <div className="relative aspect-21/9 w-full overflow-hidden bg-slate-100">
            <img
              src={resto.bannerUrl}
              alt={resto.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white space-y-2">
              <span className="inline-block rounded-full bg-[#006948] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {resto.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {resto.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{resto.rating}</span>
                  <span>({resto.reviewsCount}+ ulasan)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{resto.area}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Prep ~{resto.prepTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6d7a72] border-t border-[#bccac0]/20">
            <p className="max-w-2xl leading-relaxed">{resto.description}</p>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[#006948] border-[#006948]/30">
                {resto.priceRange}
              </Badge>
            </div>
          </div>
        </div>

        {/* SECTION 1: Interactive Table Map */}
        <section id="table-map-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006948] text-white">
                <Table2 className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-[#131b2e]">
                1. Pilih Meja Duduk Anda
              </h2>
            </div>
            {selectedTable && (
              <span className="text-xs font-bold text-[#006948] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>Meja {selectedTable.number} Terpilih</span>
              </span>
            )}
          </div>

          <TableMap
            tables={resto.tables}
            selectedTable={selectedTable}
            onSelectTable={(table) => {
              if (selectedTable?.id === table.id) return;
              selectTable(table);
              toast.success(`Meja ${table.number} (${table.capacity} Orang) berhasil dipilih!`, {
                id: "table-select-toast",
              });
            }}
          />
        </section>

        {/* SECTION 2: Menu Catalog */}
        <section className="space-y-4 pt-4 border-t border-[#bccac0]/30">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006948] text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-[#131b2e]">
              2. Pilih Menu Pre-Order Makanan
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {resto.categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#006948] text-white shadow-2xs"
                    : "bg-white text-[#6d7a72] border border-[#bccac0]/40 hover:text-[#131b2e]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menus Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMenus.map((menu) => {
              const countInCart = cartItems
                .filter((i) => i.menuId === menu.id)
                .reduce((acc, curr) => acc + curr.quantity, 0);

              const photoCount = menu.imageUrls?.length || 1;

              return (
                <div
                  key={menu.id}
                  onClick={() => setActiveModalItem(menu)}
                  className="flex gap-4 rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-2xs hover:border-[#006948]/60 hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Menu Image */}
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {menu.isPopular && (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-black">
                        <Flame className="h-2.5 w-2.5" />
                        <span>Best</span>
                      </span>
                    )}
                    {photoCount > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-xs">
                        <Images className="h-2.5 w-2.5" />
                        <span>{photoCount}</span>
                      </span>
                    )}
                  </div>

                  {/* Menu Info */}
                  <div className="flex flex-1 flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#131b2e] group-hover:text-[#006948] transition-colors line-clamp-1">
                        {menu.name}
                      </h3>
                      <p className="text-[11px] text-[#6d7a72] line-clamp-2 leading-relaxed mt-0.5">
                        {menu.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-extrabold text-[#006948]">
                        {formatRupiah(menu.price)}
                      </span>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalItem(menu);
                        }}
                        className="h-8 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold px-3 gap-1 rounded-xl shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Tambah</span>
                        {countInCart > 0 && (
                          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fea619] text-[10px] text-black font-black">
                            {countInCart}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Menu Variant Customization Modal */}
      <MenuVariantModal
        item={activeModalItem}
        isOpen={Boolean(activeModalItem)}
        onClose={() => setActiveModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar restaurantSlug={resto.slug} />
    </div>
  );
}
