"use client";

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UtensilsCrossed, ArrowLeft, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const initialTab = searchParams.get("tab") === "staff" ? "staff" : "customer";

  const [activeTab, setActiveTab] = useState<"customer" | "staff">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSentMagicLink, setIsSentMagicLink] = useState(false);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Masukkan alamat email Anda.");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
          },
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        setIsSentMagicLink(true);
        toast.success("Magic link telah dikirim ke email Anda!");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal mengirim link masuk.";
        toast.error(msg);
      }
    });
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    startTransition(async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Email atau password salah.");
          return;
        }

        toast.success("Login berhasil! Mengalihkan ke dashboard...");
        const role = data.user?.app_metadata?.role;
        if (role === "super_admin") {
          router.push("/super-admin");
        } else {
          router.push("/dashboard/kds");
        }
        router.refresh();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Link href="/" className="flex items-center gap-2 group mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#006948] text-white shadow-md transition-transform group-hover:scale-105">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#006948]">QuickDine</h1>
        <p className="text-xs text-[#6d7a72]">Platform Reservasi & Pre-Order Kuliner</p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#eaedff] p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("customer");
            setIsSentMagicLink(false);
          }}
          className={`rounded-lg py-2.5 transition-all ${
            activeTab === "customer"
              ? "bg-white text-[#006948] shadow-xs"
              : "text-[#6d7a72] hover:text-[#131b2e]"
          }`}
        >
          Pelanggan
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("staff");
            setIsSentMagicLink(false);
          }}
          className={`rounded-lg py-2.5 transition-all ${
            activeTab === "staff"
              ? "bg-white text-[#006948] shadow-xs"
              : "text-[#6d7a72] hover:text-[#131b2e]"
          }`}
        >
          Staf / Pemilik Resto
        </button>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 sm:p-8 shadow-sm">
        {activeTab === "customer" ? (
          isSentMagicLink ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-[#131b2e]">Periksa Email Anda</h2>
              <p className="text-xs text-[#6d7a72] leading-relaxed">
                Kami telah mengirimkan link masuk ke <strong>{email}</strong>. Klik link di email tersebut untuk langsung masuk.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSentMagicLink(false)}
                className="w-full text-xs"
              >
                Gunakan Email Lain
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div className="space-y-1 text-left">
                <h2 className="text-lg font-bold text-[#131b2e]">Masuk atau Daftar</h2>
                <p className="text-xs text-[#6d7a72]">
                  Tidak perlu password — kami kirim link masuk instan ke email Anda.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-[#131b2e]">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isPending}
                className="w-full bg-[#006948] hover:bg-[#005137] text-white font-semibold gap-1.5"
              >
                <span>Kirim Magic Link</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-[11px] text-center text-[#6d7a72] pt-2">
                Belum punya akun? Link ini akan otomatis membuat akun baru untuk Anda.
              </p>
            </form>
          )
        ) : (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <h2 className="text-lg font-bold text-[#131b2e]">Masuk ke Dashboard</h2>
              <p className="text-xs text-[#6d7a72]">
                Akses portal operasional kasir, KDS dapur, dan laporan keuangan.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#131b2e]">Email Staf / Owner</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staf@resto.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#131b2e]">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full bg-[#006948] hover:bg-[#005137] text-white font-semibold gap-1.5"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6d7a72] hover:text-[#006948] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8ff] px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs text-[#6d7a72]">Memuat halaman masuk...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
