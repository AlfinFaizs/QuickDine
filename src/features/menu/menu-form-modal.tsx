"use client";
// src/features/menu/menu-form-modal.tsx
// Modal formulir tambah/ubah menu dengan upload multi-foto otomatis (1-5 foto per hidangan)

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, RefreshCw, CheckCircle2, Sparkles, Star, Plus } from "lucide-react";
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

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80";

export function MenuFormModal({ isOpen, itemToEdit, onClose, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<MenuCategory, "Semua">>("Makanan Utama");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("15");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([DEFAULT_IMAGE]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
      setPrepTime(itemToEdit.prepTimeMinutes.toString());
      setDescription(itemToEdit.description);
      const list = itemToEdit.imageUrls && itemToEdit.imageUrls.length > 0
        ? itemToEdit.imageUrls
        : [itemToEdit.imageUrl || DEFAULT_IMAGE];
      setImages(list);
      setIsAvailable(itemToEdit.isAvailable);
    } else {
      setName("");
      setCategory("Makanan Utama");
      setPrice("");
      setPrepTime("15");
      setDescription("");
      setImages([DEFAULT_IMAGE]);
      setIsAvailable(true);
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Multi-File Upload dengan Auto-Crop & Auto-Compress
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    try {
      const newCompressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (images.length + newCompressedList.length >= 5) {
          toast.warning("Maksimal 5 foto per hidangan.", { id: "upload-toast" });
          break;
        }
        const compressed = await processAndCompressImage(files[i], 800, 800, 0.82);
        newCompressedList.push(compressed);
      }

      if (newCompressedList.length > 0) {
        // Jika sebelumnya hanya gambar default, gantikan
        setImages((prev) => {
          const filtered = prev.filter((img) => img !== DEFAULT_IMAGE);
          return [...filtered, ...newCompressedList];
        });
        toast.success(
          `${newCompressedList.length} foto berhasil diunggah & dipotong ideal (800×800 px).`,
          { id: "upload-toast" }
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses foto.";
      toast.error(msg, { id: "upload-toast" });
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
    toast.success("Foto utama berhasil diperbarui.", { id: "primary-photo-toast" });
  };

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length > 0 ? updated : [DEFAULT_IMAGE];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const finalImages = images.length > 0 ? images : [DEFAULT_IMAGE];

    onSave(
      {
        name: name.trim(),
        category,
        price: parseInt(price, 10) || 0,
        prepTimeMinutes: parseInt(prepTime, 10) || 15,
        description: description.trim(),
        imageUrl: finalImages[0],
        imageUrls: finalImages,
        isAvailable,
      },
      itemToEdit ? itemToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#bccac0]/30 overflow-hidden space-y-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
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
          {/* MULTI-FOTO UPLOAD GALLERY SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#131b2e]">
                Galeri Foto Menu ({images.length}/5 Foto)
              </label>
              <span className="text-[10px] text-[#6d7a72]">Foto pertama adalah foto sampul (cover).</span>
            </div>

            {/* Photo Thumbnails Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 p-3 rounded-2xl border border-[#bccac0]/40 bg-[#faf8ff]">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-square rounded-xl overflow-hidden border bg-slate-200 group ${
                    idx === 0 ? "border-[#006948] ring-2 ring-[#006948]/30" : "border-[#bccac0]/60"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Foto ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={imgUrl.startsWith("data:")}
                  />

                  {/* Primary Badge */}
                  {idx === 0 ? (
                    <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-md bg-[#006948] px-1.5 py-0.5 text-[8px] font-black text-white shadow-xs">
                      <Star className="h-2 w-2 fill-white" />
                      Sampul
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity p-1 text-center"
                    >
                      Jadikan Sampul
                    </button>
                  )}

                  {/* Delete Thumbnail Button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Hapus foto ini"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Add Photo Button Tile */}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="aspect-square rounded-xl border-2 border-dashed border-[#006948]/40 hover:border-[#006948] bg-emerald-50/50 hover:bg-emerald-50 flex flex-col items-center justify-center text-[#006948] transition-colors p-2"
                >
                  {isProcessingImage ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span className="text-[9px] font-bold mt-1 text-center leading-tight">
                        + Tambah Foto
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-[10px] text-[#6d7a72] leading-tight flex items-center gap-1 pt-0.5">
              <Sparkles className="h-3 w-3 text-[#006948] shrink-0" />
              <span>Semua foto otomatis dipotong tengah ke rasio persegi 800×800 px (di bawah 100KB).</span>
            </p>
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
