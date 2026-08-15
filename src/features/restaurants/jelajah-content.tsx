"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Star,
  Flame,
  ArrowRight,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  MOCK_RESTAURANTS,
  type MockRestaurant,
} from "@/features/restaurants/mock-data";

type SortKey = "rating" | "distance" | "tables" | "prep";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Rating Tertinggi" },
  { key: "distance", label: "Jarak Terdekat" },
  { key: "tables", label: "Meja Terbanyak" },
  { key: "prep", label: "Paling Cepat Saji" },
];

function sortRestaurants(list: MockRestaurant[], sort: SortKey) {
  return [...list].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "distance") return a.distanceKm - b.distanceKm;
    if (sort === "tables") return b.availableTables - a.availableTables;
    if (sort === "prep") return parseInt(a.prepTime) - parseInt(b.prepTime);
    return 0;
  });
}

export default function JelajahContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeSort, setActiveSort] = useState<SortKey>("rating");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    const base = MOCK_RESTAURANTS.filter((r) => {
      const matchCat =
        activeCategory === "Semua"
          ? true
          : activeCategory === "Meja Ready"
          ? r.availableTables > 0
          : r.category === activeCategory;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === "" ||
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.popularItem.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
    return sortRestaurants(base, activeSort);
  }, [searchQuery, activeCategory, activeSort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.key === activeSort)?.label ?? "Urutkan";

  function clearSearch() {
    setSearchQuery("");
    setVisibleCount(9);
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-20">
      {/* ── Page Header + Search + Filters ── */}
      <div className="bg-white border-b border-[#bccac0]/30 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                Jelajahi Semua Restoran
              </h1>
              <p className="mt-1 text-sm text-[#6d7a72]">
                Temukan restoran terbaik dan pesan meja sekarang
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006948]/10 px-3 py-1 text-xs font-semibold text-[#006948] border border-[#006948]/20 self-start sm:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-[#006948] animate-pulse" />
              {filtered.length} Restoran Tersedia
            </span>
          </div>

          {/* Search + Sort */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder="Cari nama restoran, menu, atau area..."
                className="w-full h-11 rounded-xl border border-[#bccac0]/40 bg-white pl-10 pr-10 text-sm text-[#131b2e] placeholder:text-[#6d7a72] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] hover:text-[#131b2e]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown((v) => !v)}
                className="flex items-center gap-2 h-11 rounded-xl border border-[#bccac0]/40 bg-white px-4 text-sm text-[#131b2e] hover:border-[#006948]/40 transition-colors whitespace-nowrap"
              >
                <ArrowUpDown className="h-4 w-4 text-[#006948]" />
                {activeSortLabel}
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#6d7a72]" />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-[#bccac0]/40 bg-white shadow-lg overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setActiveSort(opt.key);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        activeSort === opt.key
                          ? "bg-[#006948]/10 text-[#006948] font-semibold"
                          : "text-[#131b2e] hover:bg-[#f2f3ff]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(9);
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#006948] text-white shadow-sm"
                      : "bg-white text-[#131b2e] border border-[#bccac0]/40 hover:bg-[#f2f3ff]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Result info ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-xs text-[#6d7a72]">
          Menampilkan{" "}
          <span className="font-semibold text-[#131b2e]">{visible.length}</span>{" "}
          dari{" "}
          <span className="font-semibold text-[#131b2e]">{filtered.length}</span>{" "}
          restoran
          {activeCategory !== "Semua" && (
            <span> dalam kategori{" "}
              <span className="font-semibold text-[#006948]">{activeCategory}</span>
            </span>
          )}
          {searchQuery && (
            <span> untuk &quot;<span className="font-semibold text-[#006948]">{searchQuery}</span>&quot;</span>
          )}
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Search className="h-12 w-12 text-[#bccac0]" />
            <p className="text-sm font-semibold text-[#131b2e]">Tidak ada restoran yang cocok</p>
            <p className="text-xs text-[#6d7a72]">Coba kata kunci lain atau ubah filter kategori</p>
            <Button variant="outline" onClick={clearSearch} className="mt-2 text-xs">
              Reset Pencarian
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((resto) => {
              const isFull = resto.availableTables === 0;
              return (
                <Link
                  key={resto.id}
                  href={`/${resto.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#bccac0]/40 bg-white shadow-2xs hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={resto.imageUrl}
                      alt={resto.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      {isFull ? (
                        <Badge variant="danger" className="shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          Meja Penuh
                        </Badge>
                      ) : (
                        <Badge variant="success" className="shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {resto.availableTables} Meja Ready
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{resto.rating}</span>
                      <span className="text-white/60">({resto.reviewsCount})</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#006948]">
                        {resto.category}
                      </span>
                      <h2 className="text-base font-bold text-[#131b2e] line-clamp-1 group-hover:text-[#006948] transition-colors">
                        {resto.name}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#6d7a72] pt-1 border-t border-[#bccac0]/20">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#006948] shrink-0" />
                        <span className="truncate">{resto.distanceKm} km • {resto.area.split(",")[0]}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#006948] shrink-0" />
                        ~{resto.prepTime}
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#f2f3ff] p-2 text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#131b2e] truncate">
                        <Flame className="h-3.5 w-3.5 text-[#fea619] shrink-0" />
                        <span className="truncate">{resto.popularItem}</span>
                      </span>
                      <span className="font-semibold text-[#006948] shrink-0 ml-1">{resto.priceRange}</span>
                    </div>
                    <div className="pt-1 flex items-center justify-between text-xs font-semibold text-[#006948]">
                      <span>Pilih Meja &amp; Menu</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {hasMore && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((n) => n + 6)}
              className="gap-2 border-[#bccac0]/60 text-[#131b2e] hover:bg-[#f2f3ff] font-semibold text-sm px-8"
            >
              Tampilkan Lebih Banyak ({filtered.length - visibleCount} lainnya)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
