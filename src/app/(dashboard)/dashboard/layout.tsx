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
  Bell
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

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#006948] text-white shadow-2xs"
                    : "text-[#131b2e] hover:bg-[#f2f3ff]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
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
            Kopi Kenangan Senopati — <span className="text-[#006948]">Cabang Utama</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#006948] border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KDS Live Online</span>
            </div>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
