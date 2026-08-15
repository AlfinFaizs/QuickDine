"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isSubmitting || isLoading) return;
    setIsSubmitting(true);
    try {
      onConfirm();
    } finally {
      // Debounce unlock
      setTimeout(() => {
        setIsSubmitting(false);
      }, 400);
    }
  };

  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#bccac0]/40 space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Icon & Header */}
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isDanger
                ? "bg-red-100 text-red-600"
                : isWarning
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-[#006948]"
            }`}
          >
            {isDanger || isWarning ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Info className="h-5 w-5" />
            )}
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-bold text-[#131b2e] leading-snug">
              {title}
            </h3>
            <p className="text-xs text-[#6d7a72] leading-relaxed">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || isSubmitting}
            className="text-[#6d7a72] hover:text-[#131b2e] p-1 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#bccac0]/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading || isSubmitting}
            className="text-xs h-9 px-4 font-semibold text-[#131b2e]"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            isLoading={isLoading || isSubmitting}
            className={`text-xs h-9 px-5 font-bold text-white transition-all ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : isWarning
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-[#006948] hover:bg-[#005137]"
            }`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
