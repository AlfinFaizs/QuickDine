"use client";
// src/app/(super-admin)/super-admin/layout.tsx
// Layout Super Admin dengan navigasi Sidebar Kiri permanen (senada dengan dashboard kasir)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  LayoutDashboard,
  UserCheck,
  Store,
  Receipt,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/super-admin",
      label: "Ringkasan KPI",
      icon: LayoutDashboard,
      isActive: pathname === "/super-admin",
    },
    {
      href: "/super-admin/verifikasi",
      label: "Verifikasi Mitra Baru",
      icon: UserCheck,
      badge: "3",
      isActive: pathname.startsWith("/super-admin/verifikasi"),
    },
    {
      href: "/super-admin/tenants",
      label: "Direktori Mitra Resto",
      icon: Store,
      isActive: pathname.startsWith("/super-admin/tenants"),
    },
    {
      href: "/super-admin/transaksi",
      label: "Log Transaksi Nasional",
      icon: Receipt,
      isActive: pathname.startsWith("/super-admin/transaksi"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col md:flex-row">
      {/* 1. SIDEBAR KIRI (DESKTOP) */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-[#bccac0]/30 bg-white p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* Brand & Portal Badge */}
          <div className="space-y-2">
            <BrandLogo size="md" />
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#006948] border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Super Admin Portal</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1 pt-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    item.isActive
                      ? "bg-[#006948] text-white shadow-2xs"
                      : "text-[#6d7a72] hover:bg-slate-100 hover:text-[#131b2e]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                        item.isActive
                          ? "bg-white text-[#006948]"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Exit Action */}
        <div className="border-t border-[#bccac0]/20 pt-4">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#6d7a72] hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Keluar ke Website Publik"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Keluar Portal</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-[#6d7a72]/60" />
          </Link>
        </div>
      </aside>

      {/* 2. TOP BAR FOR MOBILE */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-[#bccac0]/30 px-4 py-3 shadow-2xs">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Super Admin
          </span>
          <Link href="/" className="p-1 text-[#6d7a72] hover:text-red-600">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mobile Horizontal Sub-nav */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto bg-white border-b border-[#bccac0]/20 px-3 py-2 scrollbar-none sticky top-14 z-30">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${
                item.isActive
                  ? "bg-[#006948] text-white"
                  : "text-[#6d7a72] bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[9px]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. MAIN CONTENT VIEW */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
