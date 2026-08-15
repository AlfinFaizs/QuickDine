"use client";

import { useState, useMemo } from "react";
import { MenuItemDetail, MenuItemOption } from "./restaurant-details-data";
import { X, Plus, Minus, Check, MessageSquare } from "lucide-react";
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
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, MenuItemOption>
  >(() => {
    // Pre-select required options with first choice
    const initial: Record<string, MenuItemOption> = {};
    item.optionGroups?.forEach((grp) => {
      if (grp.required && grp.options.length > 0) {
        initial[grp.groupName] = grp.options[0];
      }
    });
    return initial;
  });
  const [notes, setNotes] = useState("");

  // Calculate unit price including options
  const unitPrice = useMemo(() => {
    let extra = 0;
    Object.values(selectedOptions).forEach((opt) => {
      extra += opt.extraPrice || 0;
    });
    return item.price + extra;
  }, [item.price, selectedOptions]);

  const totalPrice = unitPrice * quantity;

  const handleOptionSelect = (groupName: string, option: MenuItemOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: option,
    }));
  };

  const handleConfirm = () => {
    const formattedVariants: SelectedVariant[] = Object.entries(
      selectedOptions
    ).map(([groupName, opt]) => ({
      groupName,
      optionName: opt.name,
      extraPrice: opt.extraPrice,
    }));

    onAddToCart(item, quantity, formattedVariants, notes.trim(), unitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

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
                  <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
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
                      className={`flex w-full items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? "border-[#006948] bg-emerald-50/70 text-[#006948] font-semibold ring-1 ring-[#006948]"
                          : "border-[#bccac0]/40 text-[#131b2e] hover:bg-[#faf8ff]"
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
                        <span className="text-[11px] text-[#6d7a72]">
                          +{formatRupiah(opt.extraPrice)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Kitchen Notes */}
          <div className="space-y-2 pt-2 border-t border-[#bccac0]/20">
            <label className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#006948]" />
              <span>Catatan Khusus untuk Koki</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan terlalu manis, sambal dipisah ya..."
              rows={2}
              maxLength={120}
              className="w-full rounded-xl border border-[#bccac0]/60 p-3 text-xs text-[#131b2e] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20 resize-none placeholder:text-[#6d7a72]"
            />
          </div>
        </div>

        {/* Modal Footer (Sticky Quantity + Add Button) */}
        <div className="p-4 sm:p-5 border-t border-[#bccac0]/30 bg-[#faf8ff] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-white border border-[#bccac0]/50 p-1 shadow-2xs">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#131b2e] hover:bg-slate-100 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center text-xs font-bold text-[#131b2e]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#131b2e] hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-11 bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs gap-2 shadow-md"
          >
            <span>Tambah ke Keranjang</span>
            <span>•</span>
            <span>{formatRupiah(totalPrice)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
