"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Store, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Sparkles,
  ShieldCheck,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/shared/brand-logo";
import { registerPartnerAction } from "@/features/partner/actions";
import { toast } from "sonner";

const CATEGORIES = [
  "Coffee & Cafe",
  "Asian & Noodle",
  "Steak & Grill",
  "Family Resto",
  "Dessert & Bakery",
  "Fast Food & Burger",
  "Seafood & Nusantara",
];

const BANKS = ["BCA", "Bank Mandiri", "BRI", "BNI", "Bank CIMB Niaga", "Bank Permata"];

export default function DaftarMitraPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Form State - Step 1: Profil Resto
  const [restaurantName, setRestaurantName] = useState("");
  const [category, setCategory] = useState("Coffee & Cafe");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Jakarta Selatan");

  // Form State - Step 2: Akun Owner & Operasional
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totalTables, setTotalTables] = useState(10);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(15);

  // Form State - Step 3: Rekening Payout
  const [bankName, setBankName] = useState("BCA");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!restaurantName || !address) {
        toast.error("Mohon lengkapi nama resto dan alamat.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!ownerName || !ownerPhone || !ownerEmail || !password) {
        toast.error("Mohon lengkapi data kontak dan kata sandi.");
        return;
      }
      if (password.length < 8) {
        toast.error("Kata sandi minimal 8 karakter.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAccountNumber || !bankAccountHolder) {
      toast.error("Mohon lengkapi data nomor rekening bank.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerPartnerAction({
          restaurantName,
          category,
          address,
          city,
          ownerName,
          ownerPhone,
          ownerEmail,
          password,
          totalTables: Number(totalTables),
          prepTimeMinutes: Number(prepTimeMinutes),
          bankName,
          bankAccountNumber,
          bankAccountHolder,
        });

        if (!result.success) {
          toast.error(result.error || "Pendaftaran gagal.");
          return;
        }

        toast.success("Selamat! Kemitraan resto Anda berhasil didaftarkan.");
        setCurrentStep(4); // Success Step
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <BrandLogo size="lg" textClassName="text-2xl" />
          <h1 className="text-xl font-bold text-[#131b2e] pt-1">Daftarkan Restoran Anda</h1>
          <p className="text-xs text-[#6d7a72]">
            Dapatkan pelanggan baru, kurangi meja kosong, dan kelola antrean tanpa komisi potongan makanan.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        {currentStep < 4 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: "1. Profil Resto" },
              { num: 2, label: "2. Akun & Meja" },
              { num: 3, label: "3. Rekening Payout" },
            ].map((s) => (
              <div
                key={s.num}
                className={`rounded-xl p-2.5 text-center text-xs font-semibold transition-all ${
                  currentStep === s.num
                    ? "bg-[#006948] text-white shadow-2xs"
                    : currentStep > s.num
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-white text-[#6d7a72] border border-[#bccac0]/40"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Profil Restoran */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                  <Store className="h-5 w-5 text-[#006948]" />
                  <span>Informasi Restoran</span>
                </h2>
                <p className="text-xs text-[#6d7a72]">Data ini akan ditampilkan di direktori publik QuickDine.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Nama Restoran & Cabang</label>
                  <Input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Contoh: Kopi Kenangan — Cabang Senopati"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Kategori Resto</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-[#bccac0] bg-white px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]/20"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Kota / Area</label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan / Bandung"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Alamat Lengkap</label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Senopati No. 42, Kebayoran Baru"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold gap-1.5 mt-2">
                <span>Lanjut ke Akun & Meja</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* STEP 2: Akun Owner & Operasional */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                  <User className="h-5 w-5 text-[#006948]" />
                  <span>Akun Pemilik & Meja</span>
                </h2>
                <p className="text-xs text-[#6d7a72]">Kredensial untuk mengakses dashboard, KDS, dan pengaturan meja.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Nama Pemilik / Penanggung Jawab</label>
                  <Input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Contoh: Hendra Wijaya"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Nomor WhatsApp Aktif</label>
                  <Input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="081234567890"
                    required
                  />
                  <p className="text-[10px] text-[#6d7a72] mt-1">Digunakan untuk notifikasi pesanan masuk & rekap omset harian</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#131b2e]">Email Login Dashboard</label>
                    <Input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="owner@restoran.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#131b2e]">Kata Sandi (Min 8 Karakter)</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-[#131b2e]">Jumlah Meja Awal</label>
                    <Input
                      type="number"
                      value={totalTables}
                      onChange={(e) => setTotalTables(Number(e.target.value))}
                      min={1}
                      max={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#131b2e]">Prep Masak (Menit)</label>
                    <Input
                      type="number"
                      value={prepTimeMinutes}
                      onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                      min={5}
                      max={60}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="text-xs h-11">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
                </Button>
                <Button type="submit" className="flex-1 h-11 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold gap-1.5">
                  <span>Lanjut ke Rekening Payout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Rekening Payout */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#006948]" />
                  <span>Rekening Pencairan Saldo</span>
                </h2>
                <p className="text-xs text-[#6d7a72]">Hasil penjualan pesanan customer dicairkan 100% utuh tanpa potongan komisi makanan.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Nama Bank</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-[#bccac0] bg-white px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]/20"
                  >
                    {BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Nomor Rekening Bank</label>
                  <Input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="Contoh: 1234567890"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#131b2e]">Nama Pemilik Rekening (Sesuai Buku Tabungan)</label>
                  <Input
                    type="text"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                    placeholder="Contoh: Hendra Wijaya / PT Kenangan Kuliner"
                    required
                  />
                </div>

                <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>Free Trial 14 Hari Diaktifkan Otomatis</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Setelah trial berakhir, biaya langganan flat Rp200.000/bulan. Uang penjualan makanan 100% menjadi hak resto Anda.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="text-xs h-11">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
                </Button>
                <Button
                  type="submit"
                  isLoading={isPending}
                  className="flex-1 h-11 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Selesaikan & Buka Dashboard</span>
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {currentStep === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-xs">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#131b2e]">Pendaftaran Mitra Berhasil!</h2>
                <p className="text-xs text-[#6d7a72] max-w-md mx-auto leading-relaxed">
                  Restoran <strong>{restaurantName}</strong> telah terdaftar dengan status <strong>Free Trial 14 Hari</strong>. Denah meja awal telah dibuat otomatis.
                </p>
              </div>

              <div className="pt-3 space-y-2">
                <Link href="/dashboard/kds">
                  <Button className="w-full h-11 bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs gap-1.5 shadow-md">
                    <span>Masuk ke Dashboard Resto Sekarang</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full text-xs text-[#6d7a72]">
                    Kembali ke Beranda Utama
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#6d7a72] hover:text-[#006948]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Direktori Resto</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
