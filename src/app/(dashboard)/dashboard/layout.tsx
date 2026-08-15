"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChefHat,
  LayoutGrid,
  BookOpen,
  DollarSign,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const NAV_ITEMS = [
  { name: "KDS Dapur", href: "/dashboard/kds", icon: ChefHat },
  { name: "Denah Meja Live", href: "/dashboard/tables", icon: LayoutGrid },
  { name: "Master Menu & Varian", href: "/dashboard/menu", icon: BookOpen },
  { name: "Keuangan & Payout", href: "/dashboard/finance", icon: DollarSign },
  { name: "Pengaturan Resto", href: "/dashboard/settings", icon: Settings },
];

// Mock active order count — nanti diganti data real
const ACTIVE_ORDER_COUNT = 4;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar.");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#bccac0]/30 bg-white">
        {/* Logo Header */}
        <div className="flex h-16 items-center px-6 border-b border-[#bccac0]/20">
          <BrandLogo size="sm" href="/dashboard/kds" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isKds = item.href === "/dashboard/kds";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#006948] text-white shadow-2xs"
                    : "text-[#131b2e] hover:bg-[#f2f3ff]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </span>
                {isKds && ACTIVE_ORDER_COUNT > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#006948] text-white"
                    }`}
                  >
                    {ACTIVE_ORDER_COUNT}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Action */}
        <div className="p-4 border-t border-[#bccac0]/20">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#bccac0]/30 bg-white px-4 sm:px-6">
          <div className="flex items-center md:hidden">
            <BrandLogo size="sm" href="/dashboard/kds" />
          </div>

          <div className="hidden md:block text-xs font-semibold text-[#131b2e]">
            Kopi Kenangan Senopati —{" "}
            <span className="text-[#006948]">Cabang Utama</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Orders Bell */}
            <div className="relative">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200">
                <Bell className="h-3.5 w-3.5" />
                <span>{ACTIVE_ORDER_COUNT} Pesanan Aktif</span>
              </div>
            </div>

            {/* KDS Status Indicator */}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#006948] border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">KDS Live Online</span>
            </div>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#bccac0]/30 bg-white">
          {NAV_ITEMS.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isKds = item.href === "/dashboard/kds";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                  isActive ? "text-[#006948]" : "text-[#6d7a72]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="line-clamp-1">{item.name.split(" ")[0]}</span>
                {isKds && ACTIVE_ORDER_COUNT > 0 && (
                  <span className="absolute top-1.5 right-1/4 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {ACTIVE_ORDER_COUNT}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

