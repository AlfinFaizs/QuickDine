"use client";

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
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
import { GoogleIcon } from "@/components/shared/google-icon";
import { PasswordChecklist } from "@/components/shared/password-checklist";
import { BrandLogo } from "@/components/shared/brand-logo";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const initialPortal = searchParams.get("portal") === "staff";

  const [isStaffPortal, setIsStaffPortal] = useState(initialPortal);
  const [customerMode, setCustomerMode] = useState<"login" | "register">("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });
      if (error) toast.error(error.message, { id: "auth-toast" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungkan Google.";
      toast.error(msg, { id: "auth-toast" });
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan kata sandi wajib diisi.", { id: "auth-toast" });
      return;
    }

    if (customerMode === "register") {
      if (!fullName.trim()) {
        toast.error("Nama lengkap wajib diisi.", { id: "auth-toast" });
        return;
      }
      if (!hasMinLength) {
        toast.error("Kata sandi minimal 8 karakter.", { id: "auth-toast" });
        return;
      }
      if (!hasLetterAndNumber) {
        toast.error("Kata sandi harus kombinasi huruf dan angka.", { id: "auth-toast" });
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Konfirmasi kata sandi tidak cocok.", { id: "auth-toast" });
        return;
      }
    }

    startTransition(async () => {
      try {
        if (customerMode === "register") {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
            },
          });

          if (error) {
            toast.error(error.message, { id: "auth-toast" });
            return;
          }

          if (data.session) {
            toast.success("Pendaftaran berhasil! Mengalihkan...", { id: "auth-toast" });
            router.push(nextUrl);
            router.refresh();
          } else {
            setIsRegisteredSuccess(true);
            toast.success("Akun berhasil dibuat! Silakan cek email.", { id: "auth-toast" });
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            toast.error("Email atau kata sandi tidak sesuai.", { id: "auth-toast" });
            return;
          }

          toast.success("Login berhasil! Mengalihkan...", { id: "auth-toast" });
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
        toast.error(msg, { id: "auth-toast" });
      }
    });
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan kata sandi wajib diisi.", { id: "auth-toast" });
      return;
    }

    startTransition(async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Akses ditolak: Email atau kata sandi salah.", { id: "auth-toast" });
          return;
        }

        const role = data.user?.app_metadata?.role;
        if (role === "super_admin") {
          toast.success("Login Super Admin berhasil!", { id: "auth-toast" });
          router.push("/super-admin");
        } else {
          toast.success("Login Staf Restoran berhasil!", { id: "auth-toast" });
          router.push("/dashboard/kds");
        }
        router.refresh();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal masuk portal staf.";
        toast.error(msg, { id: "auth-toast" });
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center text-center space-y-1.5">
        <BrandLogo size="lg" />
        <p className="text-xs text-[#6d7a72]">
          {isStaffPortal
            ? "Portal Operasional Mitra Resto"
            : "Reservasi Meja & Pre-Order Kuliner Tanpa Antre"}
        </p>
      </div>

      <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        {!isStaffPortal ? (
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
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="w-full text-xs"
              >
                Kembali ke Form Masuk
              </Button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#bccac0]/60 bg-white px-4 py-2.5 text-xs font-semibold text-[#131b2e] shadow-2xs hover:bg-[#faf8ff] hover:border-[#006948] transition-all"
              >
                <GoogleIcon />
                <span>Lanjutkan dengan Google</span>
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-[#bccac0]/30" />
                <span className="shrink-0 px-3 text-[11px] font-medium text-[#6d7a72] whitespace-nowrap">
                  atau dengan email
                </span>
                <div className="flex-grow border-t border-[#bccac0]/30" />
              </div>

              <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#eaedff] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode("login");
                    setPassword("");
                    setConfirmPassword("");
                  }}
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
                  onClick={() => {
                    setCustomerMode("register");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className={`rounded-lg py-2 transition-all ${
                    customerMode === "register"
                      ? "bg-white text-[#006948] shadow-2xs"
                      : "text-[#6d7a72] hover:text-[#131b2e]"
                  }`}
                >
                  Daftar Baru
                </button>
              </div>

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
                      placeholder={customerMode === "register" ? "Kombinasi huruf & angka" : "••••••••"}
                      required
                      minLength={customerMode === "register" ? 8 : 6}
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

                {customerMode === "register" && (
                  <>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-[#131b2e]">Konfirmasi Kata Sandi</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          required
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] hover:text-[#131b2e]"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {password.length > 0 && (
                      <PasswordChecklist
                        hasMinLength={hasMinLength}
                        hasLetterAndNumber={hasLetterAndNumber}
                        isPasswordMatch={isPasswordMatch}
                        confirmPasswordLength={confirmPassword.length}
                      />
                    )}
                  </>
                )}

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

      <div className="space-y-3 text-center">
        {!isStaffPortal ? (
          <button
            type="button"
            onClick={() => {
              setIsStaffPortal(true);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#6d7a72] hover:text-[#006948] font-medium transition-colors"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Masuk sebagai Staf / Pemilik Resto</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsStaffPortal(false);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#6d7a72] hover:text-[#006948] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Login Pelanggan</span>
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
