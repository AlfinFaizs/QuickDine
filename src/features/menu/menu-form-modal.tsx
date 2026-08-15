"use client";
// src/features/menu/menu-form-modal.tsx
// Modal form tambah atau edit menu makanan/minuman resto

import { useState, useEffect } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardMenuItem, MenuCategory } from "@/features/menu/menu-data";

interface Props {
  isOpen: boolean;
  itemToEdit: DashboardMenuItem | null;
  onClose: () => void;
  onSave: (itemData: Omit<DashboardMenuItem, "id" | "variants">, editId?: string) => void;
}

const CATEGORIES: Array<Exclude<MenuCategory, "Semua">> = [
  "Makanan Utama",
  "Sate & Panggang",
  "Minuman",
  "Camilan",
];

export function MenuFormModal({ isOpen, itemToEdit, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<MenuCategory, "Semua">>("Makanan Utama");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("15");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
      setPrepTime(itemToEdit.prepTimeMinutes.toString());
      setDescription(itemToEdit.description);
      setImageUrl(itemToEdit.imageUrl);
      setIsAvailable(itemToEdit.isAvailable);
    } else {
      setName("");
      setCategory("Makanan Utama");
      setPrice("");
      setPrepTime("15");
      setDescription("");
      setImageUrl("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80");
      setIsAvailable(true);
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onSave(
      {
        name: name.trim(),
        category,
        price: parseInt(price, 10) || 0,
        prepTimeMinutes: parseInt(prepTime, 10) || 15,
        description: description.trim(),
        imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
        isAvailable,
      },
      itemToEdit ? itemToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#bccac0]/30 overflow-hidden space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#bccac0]/30 bg-[#faf8ff]">
          <h2 className="text-base font-extrabold text-[#131b2e]">
            {itemToEdit ? "Edit Menu Hidangan" : "Tambah Menu Hidangan Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6d7a72] hover:text-[#131b2e] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Name & Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Nama Menu *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sate Ayam Madura"
              required
              className="text-xs h-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<MenuCategory, "Semua">)}
                className="w-full rounded-xl border border-[#bccac0]/60 bg-white px-3 py-2 text-xs font-medium text-[#131b2e] focus:border-[#006948] focus:ring-1 focus:ring-[#006948]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e]">Harga (Rp) *</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
                required
                className="text-xs h-10 font-bold text-[#006948]"
              />
            </div>
          </div>

          {/* Prep Time & Image */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-bold text-[#131b2e]">Waktu Masak (Mnt)</label>
              <Input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                min="1"
                max="120"
                className="text-xs h-10"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#131b2e]">URL Foto Menu</label>
              <div className="relative">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs h-10 pl-8"
                />
                <ImageIcon className="absolute left-2.5 top-3 h-4 w-4 text-[#6d7a72]" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Deskripsi Menu</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Jelaskan bahan dan cita rasa hidangan..."
              className="w-full rounded-xl border border-[#bccac0]/60 p-3 text-xs text-[#131b2e] focus:border-[#006948] focus:ring-1 focus:ring-[#006948]"
            />
          </div>

          {/* Stock Toggle Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAvailableCheckbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-4 w-4 rounded accent-[#006948]"
            />
            <label htmlFor="isAvailableCheckbox" className="text-xs font-semibold text-[#131b2e]">
              Stok Tersedia untuk Dipesan Customer
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#bccac0]/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-9 px-4 font-semibold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#006948] hover:bg-[#005137] text-white text-xs h-9 px-5 font-bold"
            >
              {itemToEdit ? "Simpan Perubahan" : "Tambah Menu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
