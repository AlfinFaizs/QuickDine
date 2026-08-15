"use client";

import { useState } from "react";
import { BookOpen, Plus, ToggleLeft, ToggleRight, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

interface MenuItemRow {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

const INITIAL_MENUS: MenuItemRow[] = [
  { id: "1", name: "Kopi Kenangan Mantan", category: "Kopi Signature", price: 19000, isAvailable: true },
  { id: "2", name: "Avocado Coffee", category: "Kopi Signature", price: 28000, isAvailable: true },
  { id: "3", name: "Roti Coklat Klasik", category: "Roti & Toast", price: 12000, isAvailable: false },
  { id: "4", name: "Matcha Latte", category: "Non-Kopi", price: 24000, isAvailable: true },
];

export default function MenuBuilderPage() {
  const [menus, setMenus] = useState<MenuItemRow[]>(INITIAL_MENUS);

  const toggleAvailability = (id: string) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
    toast.success("Status ketersediaan menu diperbarui.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#131b2e] flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#006948]" />
            <span>Master Menu & Varian</span>
          </h1>
          <p className="text-xs text-[#6d7a72]">
            Kelola katalog makanan, harga, varian opsi, dan toggle stok habis.
          </p>
        </div>
        <Button className="bg-[#006948] hover:bg-[#005137] text-white text-xs h-9 gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Tambah Menu Baru</span>
        </Button>
      </div>

      {/* Menu List Table */}
      <div className="rounded-2xl border border-[#bccac0]/30 bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] border-b border-[#bccac0]/20 text-[#6d7a72] uppercase font-semibold">
            <tr>
              <th className="p-4">Nama Menu</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Status Stok</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bccac0]/20 text-[#131b2e]">
            {menus.map((item) => (
              <tr key={item.id} className="hover:bg-[#faf8ff]">
                <td className="p-4 font-bold">{item.name}</td>
                <td className="p-4 text-[#6d7a72]">{item.category}</td>
                <td className="p-4 font-semibold text-[#006948]">{formatRupiah(item.price)}</td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => toggleAvailability(item.id)}
                    className="flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    {item.isAvailable ? (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <ToggleRight className="h-5 w-5 text-emerald-600" />
                        Tersedia
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <ToggleLeft className="h-5 w-5 text-red-500" />
                        Habis
                      </span>
                    )}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6d7a72]">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
