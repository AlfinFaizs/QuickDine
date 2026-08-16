"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Store,
  Star,
  MapPin,
  Clock,
  Flame,
  CheckCircle2,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_RESTAURANTS } from "@/features/restaurants/mock-data";

// Pilih 4 restoran terpopuler berdasarkan rating tertinggi
const FEATURED_RESTOS = [...MOCK_RESTAURANTS]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4);

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: MapPin,
    title: "Pilih Restoran & Meja",
    desc: "Jelajahi ratusan restoran mitra, cek denah meja live, dan pilih meja favorit Anda secara real-time.",
  },
  {
    step: "02",
    icon: ShoppingBag,
    title: "Pre-Order Menu & Bayar",
    desc: "Pesan makanan sekarang, bayar via QRIS atau Virtual Account. Meja otomatis terkunci selama 10 menit.",
  },
  {
    step: "03",
    icon: UtensilsCrossed,
    title: "Tiba, Duduk & Langsung Santap",
    desc: "Tiba di restoran sesuai jadwal dan makanan sudah siap di meja. Tanpa antre, tanpa menunggu masak.",
  },
];

const TRUST_STATS = [
  { value: "120+", label: "Restoran Mitra" },
  { value: "50rb+", label: "Pre-Order Berhasil" },
  { value: "0 Mnt", label: "Waktu Tunggu Masak" },
];

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/jelajah?q=${encodeURIComponent(q)}` : "/jelajah");
  }

  return (
    <div className="pb-16">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#faf8ff] via-[#eaedff]/40 to-[#faf8ff] py-16 md:py-24">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#006948]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#eaedff] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-7 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#006948]/10 px-4 py-1.5 text-xs font-semibold text-[#006948] border border-[#006948]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Platform Reservasi Meja &amp; Pre-Order No. 1 di Indonesia</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#131b2e] leading-tight">
              Pesan Meja &amp; Makanan Tanpa Antre,{" "}
              <span className="text-[#006948]">Tiba Langsung Santap.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-[#6d7a72] max-w-2xl leading-relaxed">
              Pantau ketersediaan meja secara <strong>live</strong>, pre-order
              menu favorit, dan nikmati hidangan hangat yang sudah siap di meja
              saat Anda tiba di lokasi.
            </p>

            {/* Search → redirect ke /jelajah */}
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="relative flex items-center rounded-2xl bg-white p-2 shadow-lg border border-[#bccac0]/40">
                <Search className="ml-3 h-5 w-5 text-[#6d7a72] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari resto, kafe, atau menu favorit..."
                  className="w-full px-3 py-2 text-sm text-[#131b2e] placeholder:text-[#6d7a72] focus:outline-none bg-transparent"
                />
                <Button
                  type="submit"
                  className="shrink-0 rounded-xl bg-[#006948] hover:bg-[#005137] text-white gap-1.5"
                >
                  Jelajahi <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-10 pt-2 w-full max-w-lg">
              {TRUST_STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#006948]">
                    {s.value}
                  </span>
                  <span className="text-[11px] text-[#6d7a72] text-center">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CARA KERJA ───────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
            Cara Kerja QuickDine
          </h2>
          <p className="mt-2 text-sm text-[#6d7a72]">
            3 langkah mudah dari sofa sampai meja makan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col gap-4 rounded-2xl border border-[#bccac0]/30 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Step number watermark */}
                <span className="absolute top-4 right-5 text-5xl font-extrabold text-[#006948]/5 select-none leading-none">
                  {item.step}
                </span>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#006948]/10">
                  <Icon className="h-6 w-6 text-[#006948]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#131b2e] text-sm">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-[#6d7a72] leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#006948]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Termasuk dalam setiap pemesanan</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── FEATURED RESTOS (preview 4 kartu) ───────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#131b2e] tracking-tight">
              Restoran Populer Hari Ini
            </h2>
            <p className="text-xs text-[#6d7a72] mt-0.5">
              Pilihan terbaik berdasarkan rating &amp; ketersediaan meja
            </p>
          </div>
          <Link
            href="/jelajah"
            className="flex items-center gap-1 text-xs font-semibold text-[#006948] hover:underline shrink-0"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_RESTOS.map((resto) => {
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
                  <div className="absolute top-2.5 left-2.5">
                    {isFull ? (
                      <Badge variant="danger" className="shadow-sm text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        Meja Penuh
                      </Badge>
                    ) : (
                      <Badge variant="success" className="shadow-sm text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {resto.availableTables} Meja Ready
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{resto.rating}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#006948]">
                      {resto.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#131b2e] line-clamp-1 group-hover:text-[#006948] transition-colors">
                      {resto.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6d7a72] pt-1 border-t border-[#bccac0]/20">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#006948]" />
                      {resto.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#006948]" />
                      ~{resto.prepTime}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#f2f3ff] px-2.5 py-1.5 text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate text-[#131b2e]">
                      <Flame className="h-3 w-3 text-[#fea619] shrink-0" />
                      <span className="truncate">{resto.popularItem}</span>
                    </span>
                    <span className="font-semibold text-[#006948] shrink-0 ml-1">
                      {resto.priceRange}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA ke /jelajah */}
        <div className="mt-8 text-center">
          <Link href="/jelajah">
            <Button
              variant="outline"
              className="gap-2 border-[#006948] text-[#006948] hover:bg-[#006948]/5 font-semibold"
            >
              Jelajahi Semua Restoran
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ───────── B2B BANNER ───────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#006948] to-[#005137] p-8 sm:p-12 text-white shadow-xl">
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
              <Store className="h-3.5 w-3.5 text-[#fea619]" />
              <span>Kemitraan Restoran QuickDine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Punya Kafe atau Resto? <br />
              <span className="text-[#fea619]">
                Tingkatkan Omset &amp; Kurangi Meja Kosong.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Bergabung bersama puluhan mitra resto modern. Terima pesanan &amp;
              reservasi live otomatis tanpa potongan komisi makanan. Langganan flat{" "}
              <strong>Rp 200.000/bulan</strong> dengan{" "}
              <strong>Free Trial 14 Hari</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/daftar-mitra">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-[#006948] font-bold text-xs h-12 px-6 gap-1.5"
                >
                  Daftarkan Resto Anda <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?portal=staff">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-white hover:bg-white/10 text-xs h-12 px-5 font-semibold"
                >
                  Sudah Jadi Mitra? Masuk Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
