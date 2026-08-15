"use client";

import { useState, useEffect, useTransition, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Timer, 
  Table2, 
  CreditCard, 
  QrCode, 
  Phone, 
  User, 
  Clock, 
  Check, 
  AlertTriangle,
  CalendarClock,
  Info,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/features/orders/cart-store";
import { toast } from "sonner";

interface CheckoutPageProps {
  params: Promise<{ restoSlug: string }>;
}

const QUICK_ARRIVAL_OPTIONS = [
  { label: "15 Mnt lagi", minutes: 15 },
  { label: "30 Mnt lagi", minutes: 30 },
  { label: "45 Mnt lagi", minutes: 45 },
  { label: "60 Mnt lagi", minutes: 60 },
];

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { restoSlug } = use(params);
  const router = useRouter();

  // Zustand Store
  const items = useCartStore((state) => state.items);
  const selectedTable = useCartStore((state) => state.selectedTable);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [arrivalMode, setArrivalMode] = useState<"quick" | "custom">("quick");
  const [selectedArrivalMinutes, setSelectedArrivalMinutes] = useState(30);
  const [customArrivalTime, setCustomArrivalTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "va">("qris");
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 10-Minute Lock Timer Countdown (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  const timerDisplay = `${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;

  // Fees calculation
  const platformFee = paymentMethod === "qris" ? 1500 : 5500;
  const grandTotal = subtotal + platformFee;

  // Calculate target arrival display string
  const getArrivalSummary = () => {
    if (arrivalMode === "custom" && customArrivalTime) {
      return `Pukul ${customArrivalTime} WIB`;
    }
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + selectedArrivalMinutes * 60000);
    const hours = String(arrivalDate.getHours()).padStart(2, "0");
    const mins = String(arrivalDate.getMinutes()).padStart(2, "0");
    return `Pukul ${hours}:${mins} WIB (${selectedArrivalMinutes} menit lagi)`;
  };

  // If cart is empty or no table selected, show notice
  if (items.length === 0 || !selectedTable) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
        <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-8 max-w-md text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#131b2e]">Keranjang Belum Siap</h2>
            <p className="text-xs text-[#6d7a72]">
              Silakan pilih meja dan menu makanan di halaman restoran terlebih dahulu.
            </p>
          </div>
          <Link href={`/${restoSlug}`}>
            <Button className="w-full bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold h-11 mt-2">
              Kembali ke Menu Restoran
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Mohon lengkapi nama dan nomor WhatsApp Anda.");
      return;
    }
    if (arrivalMode === "custom" && !customArrivalTime) {
      toast.error("Mohon tentukan jam rencana kedatangan Anda.");
      return;
    }
    if (!agreedPolicy) {
      toast.error("Mohon setujui ketentuan pembatalan & toleransi kedatangan.");
      return;
    }

    startTransition(async () => {
      const orderId = `QD-${Date.now().toString().slice(-6)}`;
      toast.success("Pembayaran berhasil diverifikasi!");
      clearCart();
      router.push(`/${restoSlug}/order/${orderId}`);
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#bccac0]/30 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
        <Link
          href={`/${restoSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#131b2e] hover:text-[#006948]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Ubah Pesanan</span>
        </Link>
        <span className="text-xs font-bold text-[#006948]">Checkout & Pembayaran</span>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-6 space-y-6">
        {/* 10-Minute Lock Timer Alert */}
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Meja {selectedTable.number} Terkunci untuk Anda</p>
              <p className="text-[11px] text-amber-800/90">
                Selesaikan pembayaran sebelum batas waktu berakhir agar meja tidak lepas.
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-black text-white shadow-xs">
            {timerDisplay}
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Section 1: Customer Data */}
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-left">
            <h2 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
              <User className="h-4 w-4 text-[#006948]" />
              <span>Data Pemesan & Notifikasi</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#131b2e]">Nama Lengkap</label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#131b2e]">Nomor WhatsApp Aktif</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                  <Input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="081234567890"
                    required
                    className="pl-10"
                  />
                </div>
                <p className="text-[10px] text-[#6d7a72] mt-1">
                  Struk digital dan live tracking persiapan masak akan dikirimkan ke nomor ini.
                </p>
              </div>

              {/* Arrival Time Picker (Quick vs Custom Time) */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#131b2e] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#006948]" />
                    <span>Rencana Jam Tiba di Restoran</span>
                  </label>
                  <span className="text-[11px] font-bold text-[#006948]">
                    {getArrivalSummary()}
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#eaedff] p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setArrivalMode("quick")}
                    className={`rounded-lg py-1.5 transition-all flex items-center justify-center gap-1.5 ${
                      arrivalMode === "quick"
                        ? "bg-white text-[#006948] shadow-2xs font-semibold"
                        : "text-[#6d7a72] hover:text-[#131b2e]"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Pilihan Cepat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setArrivalMode("custom")}
                    className={`rounded-lg py-1.5 transition-all flex items-center justify-center gap-1.5 ${
                      arrivalMode === "custom"
                        ? "bg-white text-[#006948] shadow-2xs font-semibold"
                        : "text-[#6d7a72] hover:text-[#131b2e]"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Pilih Jam Spesifik</span>
                  </button>
                </div>

                {arrivalMode === "quick" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {QUICK_ARRIVAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.minutes}
                        type="button"
                        onClick={() => setSelectedArrivalMinutes(opt.minutes)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          selectedArrivalMinutes === opt.minutes
                            ? "border-[#006948] bg-emerald-50 text-[#006948] ring-1 ring-[#006948]"
                            : "border-[#bccac0]/40 text-[#131b2e] hover:bg-[#faf8ff]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="pt-1">
                    <div className="relative">
                      <CalendarClock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                      <Input
                        type="time"
                        value={customArrivalTime}
                        onChange={(e) => setCustomArrivalTime(e.target.value)}
                        required={arrivalMode === "custom"}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-[10px] text-[#6d7a72] mt-1">
                      Tentukan jam tiba Anda hari ini (minimal 15 menit dari sekarang).
                    </p>
                  </div>
                )}

                <p className="text-[10px] text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/50 flex items-start gap-1.5">
                  <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Koki Dapur:</strong> Makanan mulai dimasak tepat <strong>15 menit</strong> sebelum jam tiba agar tersaji hangat saat Anda duduk.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Order Item Summary */}
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#bccac0]/20 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#131b2e]">Rincian Pesanan</h2>
                <p className="text-[11px] text-[#6d7a72]">{restaurantName}</p>
              </div>
              <span className="text-xs font-bold text-[#006948] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Meja {selectedTable.number} ({selectedTable.capacity} Kursi)
              </span>
            </div>

            <div className="divide-y divide-[#bccac0]/20 space-y-2">
              {items.map((item) => (
                <div key={item.cartItemId} className="pt-2 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#131b2e]">
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedVariants.length > 0 && (
                      <p className="text-[11px] text-[#6d7a72]">
                        {item.selectedVariants.map((v) => v.optionName).join(" • ")}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-[10px] text-amber-700 italic">
                        Catatan: &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-[#131b2e] shrink-0">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 sm:p-6 shadow-2xs space-y-3 text-left">
            <h2 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#006948]" />
              <span>Metode Pembayaran</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === "qris"
                    ? "border-[#006948] bg-emerald-50 text-[#006948] ring-1 ring-[#006948]"
                    : "border-[#bccac0]/40 text-[#131b2e] hover:bg-[#faf8ff]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="h-5 w-5 text-[#006948]" />
                  <div>
                    <p className="text-xs font-bold">QRIS Instant</p>
                    <p className="text-[10px] text-[#6d7a72]">Gopay, OVO, Dana, BCA Mobile</p>
                  </div>
                </div>
                {paymentMethod === "qris" && <Check className="h-4 w-4 text-[#006948]" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("va")}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === "va"
                    ? "border-[#006948] bg-emerald-50 text-[#006948] ring-1 ring-[#006948]"
                    : "border-[#bccac0]/40 text-[#131b2e] hover:bg-[#faf8ff]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#006948]" />
                  <div>
                    <p className="text-xs font-bold">Virtual Account</p>
                    <p className="text-[10px] text-[#6d7a72]">BCA, Mandiri, BRI, BNI</p>
                  </div>
                </div>
                {paymentMethod === "va" && <Check className="h-4 w-4 text-[#006948]" />}
              </button>
            </div>
          </div>

          {/* Section 4: Price Breakdown & Policy Consent */}
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-left">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6d7a72]">
                <span>Subtotal Makanan</span>
                <span className="text-[#131b2e] font-semibold">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6d7a72]">
                <span>Biaya Layanan ({paymentMethod.toUpperCase()})</span>
                <span className="text-[#131b2e] font-semibold">{formatRupiah(platformFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#006948] pt-2 border-t border-[#bccac0]/30">
                <span>Total Pembayaran</span>
                <span className="text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Non-refundable & Grace period consent */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => setAgreedPolicy(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#006948] focus:ring-[#006948]"
                required
              />
              <span className="text-[11px] text-[#6d7a72] leading-relaxed">
                Saya menyetujui pesanan pre-order ini bersifat <strong>non-refundable</strong>. Jika terlambat lebih dari 15 menit dari jam tiba yang dipilih, makanan dibungkus (takeaway) dan meja dibuka kembali untuk umum.
              </span>
            </label>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full h-12 bg-[#006948] hover:bg-[#005137] text-white font-extrabold text-xs gap-2 shadow-lg"
            >
              <span>Bayar & Kunci Meja Sekarang</span>
              <span>•</span>
              <span>{formatRupiah(grandTotal)}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
