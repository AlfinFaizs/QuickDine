"use client";
// src/features/menu/menu-variant-modal.tsx
// Modal pengelola opsi varian menu (suhu, level pedas, topping ekstra) dengan bahasa non-teknis

import { useState } from "react";
import { X, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardMenuItem, MenuVariantGroup } from "@/features/menu/menu-data";

interface Props {
  isOpen: boolean;
  item: DashboardMenuItem | null;
  onClose: () => void;
  onSaveVariants: (itemId: string, variants: MenuVariantGroup[]) => void;
}

export function MenuVariantModal({ isOpen, item, onClose, onSaveVariants }: Props) {
  const [variants, setVariants] = useState<MenuVariantGroup[]>(() => item?.variants || []);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupType, setNewGroupType] = useState<"single" | "multiple">("single");

  if (!isOpen || !item) return null;

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: MenuVariantGroup = {
      id: `vg-${Date.now()}`,
      name: newGroupName.trim(),
      type: newGroupType,
      required: newGroupType === "single",
      options: [{ name: "Pilihan Default", extraPrice: 0 }],
    };
    setVariants((prev) => [...prev, newGroup]);
    setNewGroupName("");
  };

  const handleRemoveGroup = (groupId: string) => {
    setVariants((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleAddOption = (groupId: string) => {
    setVariants((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, options: [...g.options, { name: "Opsi Baru", extraPrice: 0 }] }
          : g
      )
    );
  };

  const handleOptionChange = (
    groupId: string,
    optIdx: number,
    field: "name" | "extraPrice",
    val: string | number
  ) => {
    setVariants((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const newOpts = [...g.options];
        newOpts[optIdx] = { ...newOpts[optIdx], [field]: val };
        return { ...g, options: newOpts };
      })
    );
  };

  const handleRemoveOption = (groupId: string, optIdx: number) => {
    setVariants((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, options: g.options.filter((_, i) => i !== optIdx) };
      })
    );
  };

  const handleSave = () => {
    onSaveVariants(item.id, variants);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#bccac0]/30 overflow-hidden space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#bccac0]/30 bg-[#faf8ff] shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-[#131b2e]">
              Pengaturan Varian &amp; Opsi Tambahan
            </h2>
            <p className="text-xs text-[#006948] font-bold mt-0.5">{item.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6d7a72] hover:text-[#131b2e] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="px-6 py-2 overflow-y-auto space-y-4 flex-1">
          {variants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#bccac0] p-6 text-center text-xs text-[#6d7a72]">
              Menu ini belum memiliki kelompok varian. Tambahkan kelompok varian di bawah (contoh: Pilihan Tingkat Kepedasan, Suhu Minuman, atau Tambahan Topping).
            </div>
          ) : (
            variants.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-[#bccac0]/40 bg-[#faf8ff] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#131b2e]">{g.name}</span>
                    <span className="text-[10px] font-semibold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {g.type === "single" ? "Wajib Pilih 1 Opsi" : "Bisa Pilih Lebih dari 1 (Opsional)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(g.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Hapus kelompok"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Option Rows */}
                <div className="space-y-2">
                  {g.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <Input
                        value={opt.name}
                        onChange={(e) =>
                          handleOptionChange(g.id, optIdx, "name", e.target.value)
                        }
                        placeholder="Nama pilihan (misal: Pedas Sedang)"
                        className="text-xs h-8 flex-1 bg-white"
                      />
                      <div className="flex items-center gap-1 shrink-0 w-36">
                        <span className="text-[10px] text-[#6d7a72] font-bold">+Rp</span>
                        <Input
                          type="number"
                          value={opt.extraPrice}
                          onChange={(e) =>
                            handleOptionChange(
                              g.id,
                              optIdx,
                              "extraPrice",
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          placeholder="0"
                          className="text-xs h-8 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(g.id, optIdx)}
                        className="p-1 text-[#6d7a72] hover:text-red-600"
                        title="Hapus opsi"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(g.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006948] hover:underline pt-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Pilihan</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Add New Group Box */}
          <div className="rounded-xl border border-[#bccac0]/30 bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#131b2e]">
              + Tambah Kelompok Varian Baru
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Contoh: Level Pedas / Topping"
                className="text-xs h-8 sm:col-span-2"
              />
              <select
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value as "single" | "multiple")}
                className="rounded-lg border border-[#bccac0]/60 bg-white px-2 py-1 text-xs font-medium text-[#131b2e]"
              >
                <option value="single">Wajib Pilih 1 Pilihan</option>
                <option value="multiple">Bisa Pilih Banyak Pilihan</option>
              </select>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddGroup}
              disabled={!newGroupName.trim()}
              className="text-xs h-8 gap-1 font-semibold text-[#006948] border-[#006948]/30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambahkan Kelompok Varian</span>
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-[#bccac0]/20 bg-white shrink-0">
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
            type="button"
            size="sm"
            onClick={handleSave}
            className="bg-[#006948] hover:bg-[#005137] text-white text-xs h-9 px-5 font-bold gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Simpan Opsi Varian</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
