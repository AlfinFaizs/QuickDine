"use client";
// src/app/(super-admin)/super-admin/layout.tsx
// Layout Super Admin dengan Sidebar Kiri (Desktop) & Bottom Navigation (Mobile/Android)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { LayoutDashboard, Store, LogOut, ShieldCheck, Server } from "lucide-react";

const SUPER_ADMIN_NAV = [
  {
    name: "Ringkasan KPI",
    href: "/super-admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Mitra Restoran",
    href: "/super-admin/tenants",
    icon: Store,
    badge: "10 Baru",
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#faf8ff] text-[#131b2e]">
      {/* 1. Sidebar Desktop (Menu Kiri) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#bccac0]/30 bg-white">
        {/* Logo & Portal Badge */}
        <div className="flex h-16 flex-col justify-center px-5 border-b border-[#bccac0]/20">
          <div className="flex items-center justify-between">
            <BrandLogo size="sm" href="/super-admin" />
            <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-[#006948] border border-emerald-200">
              <ShieldCheck className="h-3 w-3" />
              <span>Admin</span>
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 p-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#6d7a72]">
            Menu Utama Platform
          </div>

          {SUPER_ADMIN_NAV.map((item) => {
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
                    : "text-[#131b2e] hover:bg-slate-100 hover:text-[#006948]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </span>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                      isActive
                        ? "bg-white/25 text-white"
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

        {/* Sidebar Bottom Action: Exit to Public Website */}
        <div className="p-4 border-t border-[#bccac0]/20">
          <Link
            href="/"
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar ke Beranda</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-[#bccac0]/30 bg-white px-4 sm:px-6 lg:px-8 shadow-2xs">
          {/* Mobile Brand Logo */}
          <div className="flex items-center gap-2 md:hidden">
            <BrandLogo size="sm" href="/super-admin" />
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-[#006948] border border-emerald-200">
              Admin
            </span>
          </div>

          {/* Desktop Subtitle */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#131b2e]">
            <span className="text-[#6d7a72]">Pusat Kendali Eksekutif Platform —</span>
            <span className="text-[#006948] font-bold">QuickDine Indonesia</span>
          </div>

          {/* Server Health Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#006948] border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Sistem Server Stabil</span>
            </div>
          </div>
        </header>

        {/* Page Children (Spacious & Clean Padding) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* 3. Mobile Bottom Navigation Bar (Responsif Android / Layar Kecil) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#bccac0]/30 bg-white/95 backdrop-blur-md shadow-lg">
          {SUPER_ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/super-admin"
                ? pathname === "/super-admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center justify-center py-2.5 text-[10px] font-bold transition-colors ${
                  isActive ? "text-[#006948]" : "text-[#6d7a72]"
                }`}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="absolute top-1.5 right-1/4 flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </Link>
            );
          })}

          <Link
            href="/"
            className="flex flex-1 flex-col items-center justify-center py-2.5 text-[10px] font-bold text-red-600"
          >
            <LogOut className="h-5 w-5 mb-0.5" />
            <span>Keluar</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
