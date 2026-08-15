"use client";
// src/app/(super-admin)/super-admin/layout.tsx
// Layout Super Admin dengan navigasi Sidebar di kiri (serupa dengan dashboard kasir)

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  LayoutDashboard,
  UserCheck,
  Store,
  Landmark,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    name: "Ringkasan KPI",
    href: "/super-admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Verifikasi Mitra Baru",
    href: "/super-admin/verifikasi",
    icon: UserCheck,
    badge: 3, // 3 pendaftar baru
  },
  {
    name: "Direktori Mitra Resto",
    href: "/super-admin/tenants",
    icon: Store,
    badge: null,
  },
  {
    name: "Monitoring Payout",
    href: "/super-admin/payouts",
    icon: Landmark,
    badge: null,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf8ff] text-[#131b2e]">
      {/* 1. Sidebar Desktop (Kiri) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#bccac0]/30 bg-white">
        {/* Logo & Portal Badge */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#bccac0]/20">
          <BrandLogo size="sm" href="/super-admin" />
          <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#006948] border border-emerald-200">
            <ShieldCheck className="h-3 w-3" />
            <span>Super Admin</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 p-4">
          <span className="px-3 text-[10px] font-bold tracking-wider text-[#6d7a72] uppercase block mb-2">
            Menu Utama Platform
          </span>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/super-admin"
                ? pathname === "/super-admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#006948] text-white shadow-2xs"
                    : "text-[#131b2e] hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </span>

                {item.badge !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black leading-none ${
                      isActive
                        ? "bg-amber-400 text-black"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar: User Profile & Exit */}
        <div className="border-t border-[#bccac0]/20 p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-[#bccac0]/20">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white font-black text-xs">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#131b2e] block truncate">
                Super Admin Pusat
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live System Online
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-[#6d7a72] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar ke Beranda Web</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#bccac0]/30 bg-white px-4 md:hidden sticky top-0 z-40">
          <BrandLogo size="sm" href="/super-admin" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-[#bccac0]/60 p-2 text-[#131b2e]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#bccac0]/30 p-4 space-y-2 z-30 shadow-md">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/super-admin"
                  ? pathname === "/super-admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold ${
                    isActive
                      ? "bg-[#006948] text-white"
                      : "text-[#131b2e] hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </span>
                  {item.badge !== null && (
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar ke Beranda Web</span>
              </Link>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
