"use client";

import { use } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Utensils, 
  MapPin, 
  Navigation, 
  ArrowLeft,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

const STEPPERS = [
  { id: "received", label: "Pesanan Diterima", icon: CheckCircle2, desc: "Dapur telah menerima pesanan Anda" },
  { id: "cooking", label: "Sedang Dimasak", icon: ChefHat, desc: "Koki sedang menyiapkan hidangan hangat" },
  { id: "ready", label: "Siap Disajikan", icon: Utensils, desc: "Makanan siap di meja saat Anda tiba" },
  { id: "completed", label: "Selesai", icon: CheckCircle2, desc: "Selamat menikmati hidangan!" },
];

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ restoSlug: string; id: string }>;
}) {
  const resolvedParams = use(params);

  // Demo active state: "cooking"
  const currentStatus = "cooking";

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#bccac0]/30 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-[#131b2e]">
          <ArrowLeft className="h-4 w-4" />
          <span>Ke Beranda</span>
        </Link>
        <h1 className="text-sm font-bold text-[#131b2e]">Live Status Pesanan</h1>
        <Link href="/pesanan-saya" className="text-xs font-semibold text-[#006948]">
          Pesanan Saya
        </Link>
      </header>

      <div className="mx-auto max-w-lg px-4 py-5 space-y-5">
        {/* Status Card */}
        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 shadow-sm text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#006948]">
            <ChefHat className="h-8 w-8 animate-bounce" />
          </div>
          <Badge variant="success" className="px-3 py-1">
            Pembayaran Terverifikasi
          </Badge>
          <h2 className="text-lg font-bold text-[#131b2e]">Dapur Sedang Memasak</h2>
          <p className="text-xs text-[#6d7a72]">
            Pesanan Anda di <strong>Kopi Kenangan Senopati (Meja 04)</strong> sedang dipersiapkan untuk estimasi tiba <strong>12:30 WIB</strong>.
          </p>
        </div>

        {/* Stepper Progression */}
        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#131b2e]">
            Progres Pesanan
          </h3>

          <div className="space-y-4">
            {STEPPERS.map((step, idx) => {
              const isPast = idx < 1;
              const isCurrent = step.id === currentStatus;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-start gap-3 relative">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-[#006948] text-white ring-4 ring-emerald-100"
                        : isPast
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isCurrent ? "text-[#006948]" : "text-[#131b2e]"}`}>
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-[#6d7a72]">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location & Navigation CTA */}
        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#006948]" />
              <span className="text-xs font-bold text-[#131b2e]">Lokasi Resto</span>
            </div>
            <span className="text-xs text-[#6d7a72]">0.8 km dari Anda</span>
          </div>
          <p className="text-xs text-[#6d7a72]">Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006948] hover:bg-[#005137] py-2.5 text-xs font-bold text-white shadow-sm"
          >
            <Navigation className="h-4 w-4" />
            <span>Buka Petunjuk Arah Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
