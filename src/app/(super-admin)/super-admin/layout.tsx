"use client";
// src/app/(super-admin)/super-admin/layout.tsx
// Layout khusus portal Super Admin Platform QuickDine

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { LayoutDashboard, Store, LogOut, ShieldCheck } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/super-admin",
      label: "Ringkasan KPI Platform",
      icon: LayoutDashboard,
      isActive: pathname === "/super-admin",
    },
    {
      href: "/super-admin/tenants",
      label: "Manajemen Mitra Restoran",
      icon: Store,
      isActive: pathname.startsWith("/super-admin/tenants"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col">
      {/* Top Corporate Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#bccac0]/30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Super Admin Portal Badge */}
            <div className="flex items-center gap-3">
              <BrandLogo size="md" />
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-[#131b2e] border border-slate-200">
                <ShieldCheck className="h-3.5 w-3.5 text-[#006948]" />
                <span>Super Admin Portal</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      item.isActive
                        ? "bg-[#006948] text-white shadow-2xs"
                        : "text-[#6d7a72] hover:bg-slate-100 hover:text-[#131b2e]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Exit to Main Web */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6d7a72] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                title="Keluar ke Website Publik"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Keluar</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#bccac0]/30 bg-white py-4 text-center text-xs text-[#6d7a72]">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} QuickDine Platform Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
