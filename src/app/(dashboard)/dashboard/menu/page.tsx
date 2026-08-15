"use client";
// src/app/(dashboard)/dashboard/menu/page.tsx
// Halaman Manajemen Master Menu Restoran & Toggle Stok Habis

import { useState } from "react";
import { Plus, Search, UtensilsCrossed, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MenuCard } from "@/features/menu/menu-card";
import { MenuFormModal } from "@/features/menu/menu-form-modal";
import { MenuVariantModal } from "@/features/menu/menu-variant-modal";
import {
  INITIAL_MENU_ITEMS,
  type DashboardMenuItem,
  type MenuCategory,
  type MenuVariantGroup,
} from "@/features/menu/menu-data";
import { toast } from "sonner";

const CATEGORIES: MenuCategory[] = [
  "Semua",
  "Makanan Utama",
  "Sate & Panggang",
  "Minuman",
  "Camilan",
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<DashboardMenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardMenuItem | null>(null);
  const [variantItem, setVariantItem] = useState<DashboardMenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardMenuItem | null>(null);

  // Statistics
  const totalCount = menuItems.length;
  const availableCount = menuItems.filter((m) => m.isAvailable).length;
  const soldOutCount = totalCount - availableCount;

  // Toggle Stok Habis/Tersedia (1-Klik Instan)
  const handleToggleStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextState = !item.isAvailable;
        const msg = nextState
          ? `Stok "${item.name}" kini TERSEDIA untuk dipesan.`
          : `Stok "${item.name}" ditandai HABIS (terkunci di aplikasi customer).`;
        
        if (nextState) {
          toast.success(msg, { id: `stock-${id}` });
        } else {
          toast.warning(msg, { id: `stock-${id}` });
        }
        return { ...item, isAvailable: nextState };
      })
    );
  };

  // Add / Edit Save Handler
  const handleSaveMenu = (
    itemData: Omit<DashboardMenuItem, "id" | "variants">,
    editId?: string
  ) => {
    if (editId) {
      setMenuItems((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, ...itemData } : m))
      );
      toast.success(`Menu "${itemData.name}" berhasil diperbarui.`, { id: "menu-save" });
    } else {
      const newItem: DashboardMenuItem = {
        id: `menu-${Date.now()}`,
        ...itemData,
        variants: [],
      };
      setMenuItems((prev) => [newItem, ...prev]);
      toast.success(`Menu "${itemData.name}" berhasil ditambahkan.`, { id: "menu-save" });
    }
  };

  // Variants Save Handler
  const handleSaveVariants = (itemId: string, newVariants: MenuVariantGroup[]) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, variants: newVariants } : m))
    );
    toast.success("Opsi varian menu berhasil diperbarui.", { id: "variant-save" });
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setMenuItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    toast.success(`Menu "${deleteTarget.name}" berhasil dihapus.`, { id: "menu-delete" });
    setDeleteTarget(null);
  };

  // Filter & Search
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#131b2e]">
            Manajemen Master Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#6d7a72] mt-0.5">
            Kelola daftar hidangan, harga, varian, dan ketersediaan stok dapur secara real-time.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 px-4 gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Menu Baru</span>
        </Button>
      </div>

      {/* Stats Metric Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#131b2e]">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#6d7a72] font-semibold block">Total Menu</span>
            <span className="text-base font-extrabold text-[#131b2e]">{totalCount} Item</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#006948] font-semibold block">Stok Tersedia</span>
            <span className="text-base font-extrabold text-[#006948]">{availableCount} Item</span>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-red-600 font-semibold block">Stok Habis</span>
            <span className="text-base font-extrabold text-red-700">{soldOutCount} Item</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#bccac0]/30">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-[#006948] text-white shadow-2xs"
                  : "bg-slate-100 text-[#6d7a72] hover:bg-slate-200 hover:text-[#131b2e]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6d7a72]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari hidangan..."
            className="pl-8 text-xs h-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#bccac0] bg-white p-12 text-center space-y-2">
          <UtensilsCrossed className="mx-auto h-8 w-8 text-[#6d7a72]/60" />
          <h3 className="text-sm font-bold text-[#131b2e]">Tidak ada menu yang cocok</h3>
          <p className="text-xs text-[#6d7a72]">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onToggleStock={handleToggleStock}
              onEdit={(itemToEdit) => {
                setEditingItem(itemToEdit);
                setIsFormOpen(true);
              }}
              onManageVariants={(itemWithVariants) => {
                setVariantItem(itemWithVariants);
              }}
              onDelete={(itemToDelete) => {
                setDeleteTarget(itemToDelete);
              }}
            />
          ))}
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <MenuFormModal
        isOpen={isFormOpen}
        itemToEdit={editingItem}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveMenu}
      />

      {/* Variant Modal */}
      <MenuVariantModal
        isOpen={!!variantItem}
        item={variantItem}
        onClose={() => setVariantItem(null)}
        onSaveVariants={handleSaveVariants}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={`Hapus Menu "${deleteTarget?.name}"?`}
        description="Menu hidangan ini akan dihapus permanen dari katalog restoran dan tidak dapat lagi dipesan oleh customer."
        confirmLabel="Ya, Hapus Menu"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
