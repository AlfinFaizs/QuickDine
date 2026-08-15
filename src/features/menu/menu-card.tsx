"use client";
// src/features/menu/menu-card.tsx
// Komponen kartu menu restoran dengan toggle switch ketersediaan stok instan

import Image from "next/image";
import { Clock, Edit3, Trash2, SlidersHorizontal, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { DashboardMenuItem } from "@/features/menu/menu-data";

interface Props {
  item: DashboardMenuItem;
  onToggleStock: (id: string) => void;
  onEdit: (item: DashboardMenuItem) => void;
  onManageVariants: (item: DashboardMenuItem) => void;
  onDelete: (item: DashboardMenuItem) => void;
}

export function MenuCard({
  item,
  onToggleStock,
  onEdit,
  onManageVariants,
  onDelete,
}: Props) {
  const variantCount = item.variants.length;

  return (
    <div
      className={`group flex flex-col rounded-2xl border bg-white shadow-2xs transition-all overflow-hidden ${
        item.isAvailable
          ? "border-[#bccac0]/40 hover:border-[#006948]/50 hover:shadow-md"
          : "border-red-200 bg-red-50/20 opacity-90"
      }`}
    >
      {/* Image Thumbnail & Category */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            !item.isAvailable ? "grayscale contrast-125" : ""
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="default"
            className="bg-black/60 text-white backdrop-blur-xs text-[11px] font-semibold"
          >
            {item.category}
          </Badge>
        </div>

        {/* Out-of-Stock Overlay Indicator */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-lg">
              <AlertCircle className="h-3.5 w-3.5" />
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 space-y-3 justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-[#131b2e] leading-snug line-clamp-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="p-1.5 text-[#6d7a72] hover:text-[#006948] hover:bg-emerald-50 rounded-lg transition-colors"
                title="Edit menu"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="p-1.5 text-[#6d7a72] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus menu"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-[#6d7a72] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Prep time */}
        <div className="flex items-center justify-between border-t border-[#bccac0]/20 pt-2 text-xs">
          <span className="text-sm font-extrabold text-[#006948]">
            {formatRupiah(item.price)}
          </span>
          <span className="flex items-center gap-1 text-[#6d7a72] font-medium text-[11px]">
            <Clock className="h-3.5 w-3.5 text-[#006948]" />
            <span>~{item.prepTimeMinutes} mnt</span>
          </span>
        </div>

        {/* Variant link & Out-of-Stock Switch Toggle */}
        <div className="flex items-center justify-between border-t border-[#bccac0]/20 pt-3">
          <button
            type="button"
            onClick={() => onManageVariants(item)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#006948] hover:underline"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>
              {variantCount > 0 ? `${variantCount} Opsi Varian` : "Atur Varian"}
            </span>
          </button>

          {/* Instant Out-of-Stock Toggle Switch */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold ${
                item.isAvailable ? "text-[#006948]" : "text-red-600"
              }`}
            >
              {item.isAvailable ? "Tersedia" : "Habis"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={item.isAvailable}
              onClick={() => onToggleStock(item.id)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                item.isAvailable ? "bg-[#006948]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  item.isAvailable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
