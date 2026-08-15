"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Timer,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { calculateOrderFee } from "@/services/payment/fee-calculator";
import { createOrderAction } from "@/features/orders/actions";
import { toast } from "sonner";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ restoSlug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [arrivalTime, setArrivalTime] = useState("12:30");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bca_va" | "mandiri_va">("qris");
  const [consentChecked, setConsentChecked] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600); // 10 minutes lock
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart & Table state from session
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [tableNumber, setTableNumber] = useState("04");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = sessionStorage.getItem("quickdine_cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch {}
      } else {
        // Fallback demo cart
        setCartItems([
          { id: "m1", name: "Kopi Kenangan Mantan", price: 19000, quantity: 1 },
          { id: "m3", name: "Roti Coklat Klasik", price: 12000, quantity: 1 },
        ]);
      }
    }

    // 10 minute countdown timer
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("Waktu penguncian meja telah habis. Silakan pilih meja kembali.");
          router.push(`/${resolvedParams.restoSlug}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resolvedParams.restoSlug, router]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const { platformFee, total } = calculateOrderFee(subtotal, paymentMethod);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    if (!consentChecked) {
      toast.error("Anda wajib menyetujui kebijakan non-refundable.");
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const arrivalDateTime = new Date(`${today}T${arrivalTime}:00+07:00`).toISOString();

      const result = await createOrderAction({
        restaurantId: "10344403875971017722",
        tableId: undefined,
        customerName,
        customerPhone,
        arrivalTime: arrivalDateTime,
        paymentMethod,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          itemName: item.name,
          itemPrice: item.price,
          quantity: item.quantity,
        })),
      });

      if (!result.success) {
        toast.error(result.error || "Gagal membuat pesanan.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Pesanan berhasil dibuat! Mengalihkan ke pembayaran...");
      router.push(`/${resolvedParams.restoSlug}/order/${result.orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#bccac0]/30 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link href={`/${resolvedParams.restoSlug}`} className="flex items-center gap-2 text-xs font-semibold text-[#131b2e]">
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Menu</span>
        </Link>
        <h1 className="text-sm font-bold text-[#131b2e]">Checkout & Reservasi</h1>
        <div className="w-12" />
      </header>

      <div className="mx-auto max-w-lg px-4 py-5 space-y-5">
        {/* Table Lock Notice Bar */}
        <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-amber-600 animate-pulse" />
            <div>
              <span className="font-bold">Meja {tableNumber} Terkunci untuk Anda</span>
              <p className="text-[10px] text-amber-700">Selesaikan sebelum timer habis</p>
            </div>
          </div>
          <span className="rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-amber-800 shadow-2xs">
            {formattedTime}
          </span>
        </div>

        {/* Customer Data Form */}
        <form onSubmit={handleSubmitOrder} className="space-y-5">
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Data Pemesan
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#131b2e]">Nama Lengkap</label>
                <Input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#131b2e]">Nomor WhatsApp (Aktif)</label>
                <Input
                  type="tel"
                  placeholder="081234567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
                <p className="text-[10px] text-[#6d7a72] mt-1">Struk & status pesanan akan dikirim via WhatsApp</p>
              </div>

              <div>
                <label className="text-xs font-medium text-[#131b2e]">Estimasi Jam Tiba</label>
                <Input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                />
                <p className="text-[10px] text-[#006948] mt-1">Dapur akan mulai memasak 15 menit sebelum jam ini</p>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Metode Pembayaran
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  paymentMethod === "qris"
                    ? "border-[#006948] bg-emerald-50 text-[#006948] ring-1 ring-[#006948]"
                    : "border-[#bccac0]/60 bg-white text-[#131b2e]"
                }`}
              >
                <QrCode className="h-5 w-5 mb-1.5 text-[#006948]" />
                <span className="font-bold">QRIS Instant</span>
                <span className="text-[10px] text-[#6d7a72]">Fee: Rp 1.500</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bca_va")}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  paymentMethod === "bca_va"
                    ? "border-[#006948] bg-emerald-50 text-[#006948] ring-1 ring-[#006948]"
                    : "border-[#bccac0]/60 bg-white text-[#131b2e]"
                }`}
              >
                <CreditCard className="h-5 w-5 mb-1.5 text-[#006948]" />
                <span className="font-bold">Virtual Account</span>
                <span className="text-[10px] text-[#6d7a72]">Fee: Rp 5.500</span>
              </button>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-2xs space-y-2.5">
            <h2 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Rincian Pembayaran
            </h2>

            <div className="space-y-1.5 text-xs text-[#6d7a72]">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} Menu)</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Platform</span>
                <span>{formatRupiah(platformFee)}</span>
              </div>
              <div className="border-t border-[#bccac0]/30 pt-2 flex justify-between font-bold text-[#131b2e] text-sm">
                <span>Total Pembayaran</span>
                <span className="text-[#006948]">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Non-Refundable Consent Checkbox (PRD Bagian 3 & 5) */}
          <label className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-900 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-red-300 text-[#006948] focus:ring-[#006948]"
            />
            <span className="leading-relaxed">
              Saya memahami bahwa pesanan ini bersifat <strong>non-refundable</strong> karena bahan makanan langsung diproses dapur mendekati jam kedatangan saya.
            </span>
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!consentChecked}
            className="w-full h-12 rounded-xl bg-[#006948] hover:bg-[#005137] text-white font-bold text-sm shadow-md"
          >
            Bayar Sekarang — {formatRupiah(total)}
          </Button>
        </form>
      </div>
    </div>
  );
}
