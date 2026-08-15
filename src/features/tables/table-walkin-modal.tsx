"use client";
// src/features/tables/table-walkin-modal.tsx
// Modal untuk input tamu walk-in manual kasir

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardTable } from "@/features/tables/tables-data";

interface Props {
  table: DashboardTable;
  onClose: () => void;
  onConfirm: (tableId: string, guestName: string, phone: string) => void;
}

export function TableWalkInModal({ table, onClose, onConfirm }: Props) {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onConfirm(table.id, guestName.trim(), phone.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#bccac0]/30">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#006948]" />
            <h2 className="text-base font-extrabold text-[#131b2e]">
              Walk-In Meja {table.number}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-[#f2f3ff] transition-colors"
          >
            <X className="h-5 w-5 text-[#131b2e]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-[#6d7a72]">
            Isi data tamu walk-in untuk mengunci meja {table.number} secara manual.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#131b2e]">
              Nama Tamu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Contoh: Bapak Hendra"
              required
              className="w-full h-10 rounded-xl border border-[#bccac0]/40 px-3 text-sm text-[#131b2e] placeholder:text-[#6d7a72] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#131b2e]">
              No. HP (Opsional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full h-10 rounded-xl border border-[#bccac0]/40 px-3 text-sm text-[#131b2e] placeholder:text-[#6d7a72] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20 transition-all"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 text-xs h-10"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!guestName.trim()}
              className="flex-1 bg-[#006948] hover:bg-[#005137] text-white font-bold text-xs h-10 gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              Check-In Walk-In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
