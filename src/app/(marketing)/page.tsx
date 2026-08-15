"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight,
  Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Semua",
  "Meja Ready",
  "Coffee & Cafe",
  "Asian & Noodle",
  "Steak & Grill",
  "Family Resto",
  "Dessert & Bakery",
];

const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Kopi Kenangan Senopati",
    slug: "kopi-kenangan-senopati",
    category: "Coffee & Cafe",
    rating: 4.8,
    reviewsCount: 142,
    distanceKm: 0.8,
    area: "Senopati, Jaksel",
    prepTime: "10-15 mnt",
    priceRange: "Rp25k - Rp50k",
    availableTables: 6,
    totalTables: 12,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    tags: ["Outdoor", "Wi-Fi Cepat", "Stopkontak"],
    popularItem: "Kopi Kenangan Mantan",
  },
  {
    id: "2",
    name: "Bakmi GM Grand Indonesia",
    slug: "bakmi-gm-gi",
    category: "Asian & Noodle",
    rating: 4.9,
    reviewsCount: 380,
    distanceKm: 1.5,
    area: "Thamrin, Jakpus",
    prepTime: "12-18 mnt",
    priceRange: "Rp35k - Rp75k",
    availableTables: 3,
    totalTables: 20,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    tags: ["Family Friendly", "Halal Certified", "AC"],
    popularItem: "Bakmi Spesial GM Pangsit",
  },
  {
    id: "3",
    name: "Holycow! Steakhouse Senopati",
    slug: "holycow-senopati",
    category: "Steak & Grill",
    rating: 4.7,
    reviewsCount: 215,
    distanceKm: 1.2,
    area: "Senopati, Jaksel",
    prepTime: "18-25 mnt",
    priceRange: "Rp95k - Rp250k",
    availableTables: 0,
    totalTables: 15,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    tags: ["Wagyu Beef", "Free Refill", "Valet"],
    popularItem: "Prime Rib Eye 200g",
  },
  {
    id: "4",
    name: "Pagi Sore Padang Premium",
    slug: "pagi-sore-kemang",
    category: "Family Resto",
    rating: 4.9,
    reviewsCount: 520,
    distanceKm: 2.3,
    area: "Kemang, Jaksel",
    prepTime: "5-10 mnt",
    priceRange: "Rp50k - Rp150k",
    availableTables: 8,
    totalTables: 25,
    imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    tags: ["VIP Room", "Parkir Luas", "Keluarga"],
    popularItem: "Ayam Pop & Rendang Daging",
  },
];

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = MOCK_RESTAURANTS.filter((resto) => {
    const matchCategory =
      selectedCategory === "Semua"
        ? true
        : selectedCategory === "Meja Ready"
        ? resto.availableTables > 0
        : resto.category === selectedCategory;

    const matchSearch =
      resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.popularItem.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#faf8ff] via-[#eaedff]/30 to-[#faf8ff] py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Value Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#006948]/10 px-4 py-1.5 text-xs font-semibold text-[#006948] border border-[#006948]/20 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Platform Reservasi Meja & Pre-Order Kuliner No. 1 di Indonesia</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#131b2e] leading-tight">
              Pesan Meja & Makanan Tanpa Antre,{" "}
              <span className="text-[#006948]">Tiba Langsung Santap.</span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-[#6d7a72] max-w-2xl leading-relaxed">
              Pantau ketersediaan meja secara <strong>live</strong>, pesan makanan di muka, dan nikmati hidangan hangat yang siap di meja saat Anda tiba di lokasi.
            </p>

            {/* Search Box on Mobile/Desktop */}
            <div className="w-full max-w-xl">
              <div className="relative flex items-center rounded-2xl bg-white p-2 shadow-lg border border-[#bccac0]/40">
                <Search className="ml-3 h-5 w-5 text-[#6d7a72]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari resto, kafe, atau menu favorit..."
                  className="w-full px-3 py-2 text-sm text-[#131b2e] placeholder:text-[#6d7a72] focus:outline-none"
                />
                <Button className="shrink-0 rounded-xl bg-[#006948] hover:bg-[#005137] text-white">
                  Cari Meja
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 w-full max-w-lg text-left">
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold text-[#006948]">100%</span>
                <span className="text-[11px] text-[#6d7a72]">Pasti Dapat Meja</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold text-[#006948]">0 Mnt</span>
                <span className="text-[11px] text-[#6d7a72]">Waktu Tunggu Masak</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold text-[#006948]">QRIS/VA</span>
                <span className="text-[11px] text-[#6d7a72]">Bayar Instan Aman</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
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
      </section>

      {/* Restaurant List Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#131b2e]">
              Restoran & Kafe Populer
            </h2>
            <p className="text-xs text-[#6d7a72]">
              Pilih restoran untuk cek denah meja dan pre-order menu
            </p>
          </div>
          <span className="text-xs font-medium text-[#006948]">
            {filteredRestaurants.length} Restoran Tersedia
          </span>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRestaurants.map((resto) => {
            const isFull = resto.availableTables === 0;

            return (
              <Link
                key={resto.id}
                href={`/${resto.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#bccac0]/40 bg-white shadow-2xs hover:shadow-lg transition-all duration-200"
              >
                {/* Image & Badges */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                  <img
                    src={resto.imageUrl}
                    alt={resto.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Table Status Badge */}
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

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{resto.rating}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#006948]">
                      {resto.category}
                    </span>
                    <h3 className="text-base font-bold text-[#131b2e] line-clamp-1 group-hover:text-[#006948] transition-colors">
                      {resto.name}
                    </h3>
                  </div>

                  {/* Meta info */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6d7a72] pt-1 border-t border-[#bccac0]/20">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#006948] shrink-0" />
                      <span className="truncate">{resto.distanceKm} km • {resto.area}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#006948] shrink-0" />
                      <span>~{resto.prepTime}</span>
                    </div>
                  </div>

                  {/* Popular Item Highlight */}
                  <div className="rounded-lg bg-[#f2f3ff] p-2 text-[11px] text-[#131b2e] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <Flame className="h-3.5 w-3.5 text-[#fea619] shrink-0" />
                      <span className="truncate">{resto.popularItem}</span>
                    </div>
                    <span className="font-semibold text-[#006948] shrink-0">{resto.priceRange}</span>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#006948]">
                    <span>Pilih Meja & Menu</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* B2B Partner Call-To-Action Banner Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#006948] to-[#005137] p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-[#fea619]" />
              <span>Kemitraan Restoran QuickDine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Punya Kafe atau Resto? <br />
              <span className="text-[#fea619]">Tingkatkan Omset & Kurangi Meja Kosong.</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Bergabung bersama puluhan mitra resto modern. Terima pesanan & reservasi live otomatis tanpa potongan komisi makanan. Langganan flat Rp200.000/bulan dengan <strong>Free Trial 14 Hari</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/daftar-mitra">
                <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-[#006948] font-bold text-xs h-12 px-6 shadow-md gap-1.5">
                  <span>Daftarkan Resto Anda Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?portal=staff">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-white/10 text-xs h-12 px-5 font-semibold">
                  <span>Sudah Jadi Mitra? Masuk Portal</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
