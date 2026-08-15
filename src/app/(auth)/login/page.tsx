"use client";

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  UtensilsCrossed, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Eye,
  EyeOff,
  Store,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const initialPortal = searchParams.get("portal") === "staff";

  // State: "customer" vs "staff"
  const [isStaffPortal, setIsStaffPortal] = useState(initialPortal);
  // State for Customer: "login" vs "register"
  const [customerMode, setCustomerMode] = useState<"login" | "register">("login");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  // 1. Google 1-Click OAuth Login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });
      if (error) toast.error(error.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungkan Google.";
      toast.error(msg);
    }
  };

  // 2. Email & Password Customer (Login or Register)
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan kata sandi wajib diisi.");
      return;
    }

    startTransition(async () => {
      try {
        if (customerMode === "register") {
          if (!fullName) {
            toast.error("Nama lengkap wajib diisi.");
            return;
          }
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
            },
          });

          if (error) {
            toast.error(error.message);
            return;
          }

          if (data.session) {
            toast.success("Pendaftaran berhasil! Mengalihkan...");
            router.push(nextUrl);
            router.refresh();
          } else {
            setIsRegisteredSuccess(true);
            toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
          }
        } else {
          // Login Mode
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            toast.error("Email atau kata sandi tidak sesuai.");
            return;
          }

          toast.success("Login berhasil! Mengalihkan...");
          const role = data.user?.app_metadata?.role;
          if (role === "super_admin") {
            router.push("/super-admin");
          } else if (role === "owner" || role === "staff") {
            router.push("/dashboard/kds");
          } else {
            router.push(nextUrl);
          }
          router.refresh();
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
        toast.error(msg);
      }
    });
  };

  // 3. Staff / Resto Owner Login
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan kata sandi wajib diisi.");
      return;
    }

    startTransition(async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Akses ditolak: Email atau kata sandi salah.");
          return;
        }

        const role = data.user?.app_metadata?.role;
        if (role === "super_admin") {
          toast.success("Login Super Admin berhasil!");
          router.push("/super-admin");
        } else {
          toast.success("Login Staf Restoran berhasil!");
          router.push("/dashboard/kds");
        }
        router.refresh();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal masuk portal staf.";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Link href="/" className="flex items-center gap-2 group mb-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#006948] text-white shadow-md transition-transform group-hover:scale-105">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#006948]">QuickDine</h1>
        <p className="text-xs text-[#6d7a72]">
          {isStaffPortal
            ? "Portal Operasional Mitra Resto"
            : "Reservasi Meja & Pre-Order Kuliner Tanpa Antre"}
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        {!isStaffPortal ? (
          /* ============================================================ */
          /* CUSTOMER FLOW (Google 1-Click + Email Password / Register)  */
          /* ============================================================ */
          isRegisteredSuccess ? (
            <div className="text-center space-y-4 py-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#131b2e]">Pendaftaran Berhasil</h2>
                <p className="text-xs text-[#6d7a72] leading-relaxed">
                  Kami telah mengirimkan email konfirmasi ke <strong>{email}</strong>. Silakan verifikasi untuk melanjutkan pesanan.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsRegisteredSuccess(false);
                  setCustomerMode("login");
                }}
                className="w-full text-xs"
              >
                Kembali ke Form Masuk
              </Button>
            </div>
          ) : (
            <>
              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#bccac0]/60 bg-white px-4 py-2.5 text-xs font-semibold text-[#131b2e] shadow-2xs hover:bg-[#faf8ff] hover:border-[#006948] transition-all"
              >
                <GoogleIcon />
                <span>Lanjutkan dengan Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#bccac0]/30" />
                <span className="bg-white px-3 text-[11px] text-[#6d7a72]">atau dengan email</span>
                <div className="w-full border-t border-[#bccac0]/30" />
              </div>

              {/* Login / Register Toggle Tabs */}
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#eaedff] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCustomerMode("login")}
                  className={`rounded-lg py-2 transition-all ${
                    customerMode === "login"
                      ? "bg-white text-[#006948] shadow-2xs"
                      : "text-[#6d7a72] hover:text-[#131b2e]"
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode("register")}
                  className={`rounded-lg py-2 transition-all ${
                    customerMode === "register"
                      ? "bg-white text-[#006948] shadow-2xs"
                      : "text-[#6d7a72] hover:text-[#131b2e]"
                  }`}
                >
                  Daftar Baru
                </button>
              </div>

              {/* Customer Form */}
              <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
                {customerMode === "register" && (
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-[#131b2e]">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 text-left">
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

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-[#131b2e]">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      minLength={6}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] hover:text-[#131b2e]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isPending}
                  className="w-full bg-[#006948] hover:bg-[#005137] text-white font-semibold text-xs h-11 gap-1.5 mt-2"
                >
                  <span>{customerMode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </>
          )
        ) : (
          /* ============================================================ */
          /* RESTO STAFF / OWNER PORTAL FLOW                              */
          /* ============================================================ */
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 border border-amber-200 text-amber-900 text-xs">
              <Store className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Khusus kasir, koki dapur (KDS), dan pemilik resto mitra.</span>
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
                    placeholder="staf@restoran.com"
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] hover:text-[#131b2e]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full bg-[#006948] hover:bg-[#005137] text-white font-semibold text-xs h-11 gap-1.5"
            >
              <span>Masuk ke Dashboard Resto</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5 justify-center text-[11px] text-[#6d7a72] pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#006948]" />
              <span>Multi-tenant RLS Protected Session</span>
            </div>
          </form>
        )}
      </div>

      {/* Switch Portal & Back Links */}
      <div className="space-y-3 text-center">
        {!isStaffPortal ? (
          <button
            type="button"
            onClick={() => {
              setIsStaffPortal(true);
              setEmail("");
              setPassword("");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#6d7a72] hover:text-[#006948] font-medium transition-colors"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Masuk sebagai Staf / Pemilik Resto →</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsStaffPortal(false);
              setEmail("");
              setPassword("");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#6d7a72] hover:text-[#006948] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← Kembali ke Login Pelanggan</span>
          </button>
        )}

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#6d7a72] hover:text-[#131b2e] transition-colors"
          >
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
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
