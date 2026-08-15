"use client";
// src/features/menu/menu-form-modal.tsx
// Modal form tambah atau edit menu dengan upload foto langsung dari perangkat

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, UploadCloud, Trash2, RefreshCw, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardMenuItem, MenuCategory } from "@/features/menu/menu-data";
import { toast } from "sonner";

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

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80";

export function MenuFormModal({ isOpen, itemToEdit, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<MenuCategory, "Semua">>("Makanan Utama");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("15");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
      setPrepTime(itemToEdit.prepTimeMinutes.toString());
      setDescription(itemToEdit.description);
      setImageUrl(itemToEdit.imageUrl);
      setIsAvailable(itemToEdit.isAvailable);
      setShowUrlInput(false);
    } else {
      setName("");
      setCategory("Makanan Utama");
      setPrice("");
      setPrepTime("15");
      setDescription("");
      setImageUrl(DEFAULT_FALLBACK_IMAGE);
      setIsAvailable(true);
      setShowUrlInput(false);
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Mohon pilih berkas gambar (JPG, PNG, atau WebP).", {
        id: "img-upload-error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5 MB.", { id: "img-upload-error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrl(result);
        toast.success(`Foto "${file.name}" berhasil diunggah.`, {
          id: "img-upload-success",
        });
      }
    };
    reader.readAsDataURL(file);
  };

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
        imageUrl: imageUrl.trim() || DEFAULT_FALLBACK_IMAGE,
        isAvailable,
      },
      itemToEdit ? itemToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#bccac0]/30 overflow-hidden space-y-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#bccac0]/30 bg-[#faf8ff] shrink-0">
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
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 overflow-y-auto flex-1">
          {/* Foto Menu Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#131b2e] block">
              Foto Hidangan
            </label>

            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#bccac0]/40 bg-slate-100 h-44 group">
                <Image
                  src={imageUrl}
                  alt="Pratinjau Foto"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-[#131b2e] hover:bg-white/90 text-xs h-8 px-3 font-bold gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Ganti Foto</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setImageUrl("")}
                    className="text-xs h-8 px-3 font-bold gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#bccac0] hover:border-[#006948] rounded-2xl p-6 text-center cursor-pointer bg-[#faf8ff] transition-colors space-y-2"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#006948]">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-[#131b2e]">
                  Pilih Foto dari Galeri / Komputer
                </p>
                <p className="text-[11px] text-[#6d7a72]">
                  Format PNG, JPG, atau WebP (Maks. 5 MB)
                </p>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* URL Toggle Fallback */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-[#006948] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <LinkIcon className="h-3 w-3" />
                <span>
                  {showUrlInput
                    ? "Tutup input link URL"
                    : "Atau gunakan link foto internet"}
                </span>
              </button>

              {showUrlInput && (
                <div className="mt-1.5">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs h-8"
                  />
                </div>
              )}
            </div>
          </div>

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

          {/* Prep Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">
              Estimasi Waktu Memasak (Menit)
            </label>
            <Input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min="1"
              max="120"
              className="text-xs h-10"
            />
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

          {/* Stock Availability Toggle */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#bccac0]/20">
            <input
              type="checkbox"
              id="isAvailableCheckbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-4 w-4 rounded accent-[#006948]"
            />
            <label htmlFor="isAvailableCheckbox" className="text-xs font-semibold text-[#131b2e]">
              Stok Tersedia untuk Dipesan Pelanggan
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
