"use client";
// src/features/menu/menu-form-modal.tsx
// Modal formulir tambah atau ubah menu hidangan dengan upload foto otomatis auto-crop & kompresi

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { processAndCompressImage } from "@/lib/image-compressor";
import { toast } from "sonner";
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

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80";

export function MenuFormModal({ isOpen, itemToEdit, onClose, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<MenuCategory, "Semua">>("Makanan Utama");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("15");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

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
      setImageUrl(DEFAULT_IMAGE);
      setIsAvailable(true);
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle File Upload dengan Auto-Crop & Auto-Compress
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsProcessingImage(true);
    try {
      // Auto crop ke rasio 1:1 (800x800) dan kompres ke < 100KB
      const compressedData = await processAndCompressImage(file, 800, 800, 0.82);
      setImageUrl(compressedData);
      toast.success("Foto berhasil diunggah & disesuaikan ke ukuran ideal (800×800 px).", {
        id: "upload-toast",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses foto.";
      toast.error(msg, { id: "upload-toast" });
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
        imageUrl: imageUrl.trim() || DEFAULT_IMAGE,
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
            {itemToEdit ? "Ubah Data Menu Hidangan" : "Tambah Menu Hidangan Baru"}
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
          {/* UPLOAD FOTO SECTION DENGAN AUTO-CROP */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#131b2e] block">
              Foto Menu Hidangan
            </label>

            <div className="flex items-center gap-4 rounded-xl border border-[#bccac0]/40 bg-[#faf8ff] p-3">
              {/* Preview Box */}
              <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-[#bccac0]/60 bg-slate-200">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={imageUrl.startsWith("data:")}
                />
                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Controls & Guidelines */}
              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="text-xs h-8 px-3 gap-1.5 font-bold text-[#006948] border-[#006948]/30 hover:bg-emerald-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{imageUrl === DEFAULT_IMAGE ? "Pilih Foto dari Galeri" : "Ganti Foto"}</span>
                </Button>

                <p className="text-[10px] text-[#6d7a72] leading-tight flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#006948] shrink-0" />
                  <span>Foto apa saja otomatis dipotong &amp; disesuaikan ke ukuran ideal 800×800 px (Rasio 1:1).</span>
                </p>
              </div>
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
              <label className="text-xs font-bold text-[#131b2e]">Kategori Hidangan *</label>
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
              Estimasi Waktu Memasak di Dapur (Menit)
            </label>
            <Input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min="1"
              max="120"
              placeholder="15"
              className="text-xs h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Deskripsi &amp; Rasa</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Jelaskan bahan utama dan keunikan cita rasa hidangan..."
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
              className="bg-[#006948] hover:bg-[#005137] text-white text-xs h-9 px-5 font-bold gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{itemToEdit ? "Simpan Perubahan" : "Tambah Menu"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
