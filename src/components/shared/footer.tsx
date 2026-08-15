import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, Clock, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#bccac0]/30 bg-white pt-12 pb-8 text-[#131b2e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#006948]">QuickDine</span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-[#6d7a72]">
              Platform Reservasi Meja & Pre-Order Kuliner. Pesan meja live tanpa antre, pre-order makanan favorit, dan bayar dengan mudah sebelum tiba.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#6d7a72] pt-2">
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-[#006948]" /> Live Table Lock</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#006948]" /> 0 Min Wait</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#006948]" /> Secure Payment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#131b2e]">Navigasi</h4>
            <ul className="space-y-1.5 text-xs text-[#6d7a72]">
              <li><Link href="/" className="hover:text-[#006948] transition-colors">Direktori Restoran</Link></li>
              <li><Link href="/pesanan-saya" className="hover:text-[#006948] transition-colors">Pesanan Saya</Link></li>
              <li><Link href="/login" className="hover:text-[#006948] transition-colors">Masuk Customer</Link></li>
            </ul>
          </div>

          {/* Partner & Portal */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#131b2e]">Mitra Resto</h4>
            <ul className="space-y-1.5 text-xs text-[#6d7a72]">
              <li><Link href="/login?tab=staff" className="hover:text-[#006948] transition-colors">Portal Kasir / KDS</Link></li>
              <li><Link href="/login?tab=staff" className="hover:text-[#006948] transition-colors">Dashboard Resto Owner</Link></li>
              <li><Link href="/super-admin" className="hover:text-[#006948] transition-colors">Super Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#bccac0]/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6d7a72] gap-4">
          <p>© {new Date().getFullYear()} QuickDine Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:underline">Syarat & Ketentuan</Link>
            <Link href="/privacy" className="hover:underline">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
