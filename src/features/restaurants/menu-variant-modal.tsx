"use client";
// src/features/restaurants/menu-variant-modal.tsx
// Modal pop-up kustomisasi varian menu customer dengan galeri multi-foto, swipe gestures, dan thumbnail strip

import { useState, useMemo, useRef } from "react";
import { MenuItemDetail, MenuItemOption } from "./restaurant-details-data";
import { X, Plus, Minus, Check, MessageSquare, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { SelectedVariant } from "@/features/orders/cart-store";

interface MenuVariantModalProps {
  item: MenuItemDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItemDetail,
    quantity: number,
    variants: SelectedVariant[],
    notes: string,
    unitPrice: number
  ) => void;
}

export function MenuVariantModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: MenuVariantModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, MenuItemOption>
  >(() => {
    if (!item) return {};
    const initial: Record<string, MenuItemOption> = {};
    item.optionGroups?.forEach((grp) => {
      if (grp.required && grp.options.length > 0) {
        initial[grp.groupName] = grp.options[0];
      }
    });
    return initial;
  });
  const [notes, setNotes] = useState("");

  if (!isOpen || !item) return null;

  const images = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls
    : [item.imageUrl];
  const totalPhotos = images.length;
  const currentPhoto = images[photoIndex] || item.imageUrl;

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  };

  // Touch Swipe Gesture Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextPhoto(); // Swipe left -> next
      } else {
        handlePrevPhoto(); // Swipe right -> prev
      }
    }
    touchStartXRef.current = null;
  };

  const handleOptionSelect = (groupName: string, option: MenuItemOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: option,
    }));
  };

  const unitPrice = () => {
    let extra = 0;
    Object.values(selectedOptions).forEach((opt) => {
      extra += opt.extraPrice || 0;
    });
    return item.price + extra;
  };

  const currentUnitPrice = unitPrice();
  const totalPrice = currentUnitPrice * quantity;

  const handleConfirmAddToCart = () => {
    const formattedVariants: SelectedVariant[] = Object.entries(
      selectedOptions
    ).map(([groupName, opt]) => ({
      groupName,
      optionName: opt.name,
      extraPrice: opt.extraPrice,
    }));

    onAddToCart(item, quantity, formattedVariants, notes.trim(), currentUnitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header (Aspect 4:3) with Multi-Photo Carousel & Touch Swipe */}
        <div
          className="relative aspect-4/3 max-h-60 sm:max-h-72 w-full bg-slate-100 overflow-hidden group select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentPhoto}
            alt={`${item.name} - Foto ${photoIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-300 pointer-events-none"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Photo Counter Badge */}
          {totalPhotos > 1 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                <Images className="h-3 w-3" />
                <span>{photoIndex + 1} / {totalPhotos} Foto</span>
              </span>
            </div>
          )}

          {/* Prev / Next Chevrons */}
          {totalPhotos > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="pointer-events-auto h-8 w-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95 shadow-md"
                title="Foto sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                className="pointer-events-auto h-8 w-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95 shadow-md"
                title="Foto berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Dots Indicator */}
          {totalPhotos > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === photoIndex ? "w-5 bg-white shadow-xs" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery Strip (If Multi-Photo) */}
        {totalPhotos > 1 && (
          <div className="flex items-center gap-2 px-5 pt-3 pb-1 bg-slate-50 border-b border-[#bccac0]/20 overflow-x-auto">
            <span className="text-[10px] font-bold text-[#6d7a72] shrink-0">Pilihan Foto:</span>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPhotoIndex(idx)}
                className={`relative h-11 w-11 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === photoIndex
                    ? "border-[#006948] ring-2 ring-[#006948]/30 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#131b2e]">{item.name}</h2>
            <p className="text-xs text-[#6d7a72] leading-relaxed">
              {item.description}
            </p>
            <p className="text-base font-extrabold text-[#006948] pt-1">
              {formatRupiah(item.price)}
            </p>
          </div>

          {/* Option Groups */}
          {item.optionGroups?.map((group) => (
            <div key={group.groupName} className="space-y-2.5 pt-2 border-t border-[#bccac0]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">
                  {group.groupName}
                </span>
                {group.required ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                    Wajib
                  </span>
                ) : (
                  <span className="text-[10px] text-[#6d7a72]">Opsional</span>
                )}
              </div>

              <div className="space-y-2">
                {group.options.map((opt) => {
                  const isSelected =
                    selectedOptions[group.groupName]?.name === opt.name;

                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => handleOptionSelect(group.groupName, opt)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                        isSelected
                          ? "border-[#006948] bg-emerald-50/50 font-bold text-[#006948]"
                          : "border-[#bccac0]/40 bg-white text-[#131b2e] hover:border-[#bccac0]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[#006948] bg-[#006948] text-white"
                              : "border-[#bccac0]"
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>
                      {opt.extraPrice > 0 && (
                        <span className="text-[11px] font-semibold text-[#006948]">
                          +{formatRupiah(opt.extraPrice)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Notes for Chef */}
          <div className="space-y-2 pt-2 border-t border-[#bccac0]/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#131b2e]">
              <MessageSquare className="h-3.5 w-3.5 text-[#006948]" />
              <span>Catatan Khusus untuk Koki</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Sambal dipisah, jangan pakai daun bawang..."
              rows={2}
              maxLength={150}
              className="w-full rounded-xl border border-[#bccac0]/60 p-3 text-xs text-[#131b2e] placeholder:text-[#6d7a72]/60 focus:border-[#006948] focus:outline-hidden focus:ring-1 focus:ring-[#006948]"
            />
          </div>
        </div>

        {/* Modal Footer: Quantity & Add Button */}
        <div className="border-t border-[#bccac0]/30 bg-white p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center rounded-xl border border-[#bccac0]/60 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#131b2e] hover:bg-white transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#131b2e]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#131b2e] hover:bg-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleConfirmAddToCart}
            className="flex-1 h-11 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold px-4 rounded-xl shadow-sm justify-between"
          >
            <span>Tambah ke Pesanan</span>
            <span>{formatRupiah(totalPrice)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
