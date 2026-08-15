"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, MapPin, Search, User, ClipboardList, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  userRole?: string | null;
  userEmail?: string | null;
}

export function Navbar({ userRole, userEmail }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#bccac0]/30 bg-[#faf8ff]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-white shadow-sm transition-transform group-hover:scale-105">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#006948]">QuickDine</span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-[#6d7a72] -mt-1">Pesan Meja & Kuliner</span>
            </div>
          </Link>

          {/* Location Selector (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#131b2e] border border-[#bccac0]/40 shadow-2xs">
            <MapPin className="h-3.5 w-3.5 text-[#006948]" />
            <span>Jakarta Selatan</span>
          </div>
        </div>

        {/* Search Bar (Desktop Center) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7a72]" />
            <input
              type="text"
              placeholder="Cari kafe, resto, atau menu favorit..."
              className="w-full h-10 rounded-full border border-[#bccac0]/40 bg-white pl-10 pr-4 text-xs text-[#131b2e] placeholder:text-[#6d7a72] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20 transition-all"
            />
          </div>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            href="/pesanan-saya"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              pathname === "/pesanan-saya"
                ? "text-[#006948] bg-[#006948]/10"
                : "text-[#131b2e] hover:bg-[#f2f3ff]"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Pesanan Saya</span>
          </Link>

          {userEmail ? (
            <div className="flex items-center gap-2">
              <Link href={userRole === "owner" || userRole === "staff" ? "/dashboard/kds" : "/pesanan-saya"}>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9">
                  <User className="h-3.5 w-3.5 text-[#006948]" />
                  <span className="max-w-[120px] truncate">{userEmail.split("@")[0]}</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost" className="text-xs h-9 gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Masuk</span>
                </Button>
              </Link>
              <Link href="/login?tab=staff">
                <Button size="sm" className="text-xs h-9 bg-[#006948] hover:bg-[#005137]">
                  Daftarkan Resto
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
