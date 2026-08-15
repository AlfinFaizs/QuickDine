"use client";

import { useState } from "react";
import { X, Users, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardTable } from "./tables-data";

interface TableWalkinModalProps {
  table: DashboardTable | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmWalkin: (
    tableId: string,
    guestName: string,
    guestCount: number,
    notes: string
  ) => void;
}

export function TableWalkinModal({
  table,
  isOpen,
  onClose,
  onConfirmWalkin,
}: TableWalkinModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState(table ? table.capacity : 2);
  const [notes, setNotes] = useState("");

  if (!isOpen || !table) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onConfirmWalkin(table.id, guestName.trim(), guestCount, notes.trim());
    setGuestName("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#bccac0]/40 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#bccac0]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948]/10 text-[#006948]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#131b2e]">
                Walk-In Check-In: Meja {table.number}
              </h3>
              <p className="text-xs text-[#6d7a72]">
                {table.area} • Maksimal {table.capacity} Kursi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#6d7a72] hover:bg-slate-100 hover:text-[#131b2e]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">
              Nama Tamu / Pelanggan Walk-In <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="cth: Bapak Heru / Ibu Maya"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="text-xs h-10"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Jumlah Tamu (Pax)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 6, 8]
                .filter((n) => n <= table.capacity)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGuestCount(n)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-colors ${
                      guestCount === n
                        ? "bg-[#006948] text-white border-[#006948]"
                        : "bg-white text-[#131b2e] border-[#bccac0]/40 hover:bg-[#f2f3ff]"
                    }`}
                  >
                    {n}pax
                  </button>
                ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#131b2e]">Catatan Tambahan (Opsional)</label>
            <textarea
              placeholder="cth: Minta baby chair, bayar tunai di kasir..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-[#bccac0]/40 p-2.5 text-xs text-[#131b2e] placeholder:text-[#6d7a72] focus:border-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948]/20"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
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
              className="flex-1 bg-[#006948] hover:bg-[#005137] text-white text-xs h-10 font-bold gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Dudukkan Tamu</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
