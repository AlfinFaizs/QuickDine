"use client";
// src/features/orders/payment-simulator-modal.tsx
// Modal Simulator Pembayaran Midtrans (QRIS & Virtual Account) untuk demonstrasi live sandbox

import { useState } from "react";
import {
  QrCode,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  orderId: string;
  restaurantName: string;
  totalAmount: number;
  paymentMethod: "qris" | "mandiri_va" | "bca_va";
  onSimulateSuccess: () => Promise<void>;
  onSimulateCancel: () => void;
  onClose: () => void;
}

export function PaymentSimulatorModal({
  isOpen,
  orderId,
  restaurantName,
  totalAmount,
  paymentMethod,
  onSimulateSuccess,
  onSimulateCancel,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const vaNumber =
    paymentMethod === "bca_va"
      ? "8820 9102 3849 1029"
      : "1370 0482 9103 4455";

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s/g, ""));
    setCopied(true);
    toast.success("Nomor Virtual Account disalin.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSuccess = async () => {
    setIsProcessing(true);
    try {
      await onSimulateSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden text-left border border-[#bccac0]/30">
        {/* Top Header */}
        <div className="bg-[#006948] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">
                Midtrans Payment Simulator
              </h3>
              <p className="text-[10px] text-emerald-100/90">
                Sandbox Mode — {restaurantName}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black text-black">
            SANDBOX
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Order Summary Box */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div>
              <span className="text-[10px] text-[#6d7a72] block">No. Transaksi</span>
              <span className="text-xs font-mono font-bold text-[#131b2e]">
                #{orderId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#6d7a72] block">Total Pembayaran</span>
              <span className="text-sm font-extrabold text-[#006948]">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Method UI */}
          {paymentMethod === "qris" ? (
            <div className="text-center space-y-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-900">
                <QrCode className="h-4 w-4" />
                <span>QRIS Instant (GoPay / BCA / OVO / Dana)</span>
              </div>

              {/* QR Mock Image */}
              <div className="mx-auto w-40 h-40 bg-white p-2.5 rounded-xl border border-indigo-200 flex items-center justify-center shadow-xs">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QuickDine-Sandbox-Payment"
                  alt="QRIS Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-[11px] text-[#6d7a72]">
                Buka aplikasi m-Banking atau e-Wallet apa saja dan scan kode QR di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-950">
                <CreditCard className="h-4 w-4" />
                <span>
                  {paymentMethod === "bca_va" ? "BCA Virtual Account" : "Mandiri Virtual Account"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-cyan-200">
                <div>
                  <span className="text-[10px] text-[#6d7a72] block">Nomor Virtual Account</span>
                  <span className="text-sm font-mono font-bold text-[#131b2e] tracking-wider">
                    {vaNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#006948] bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Tersalin" : "Salin"}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#6d7a72]">
                Transfer nominal tepat sebelum batas waktu habis melalui ATM atau Mobile Banking.
              </p>
            </div>
          )}

          {/* Simulation Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#bccac0]/25">
            <span className="text-[10px] font-bold text-[#6d7a72] uppercase tracking-wider block text-center">
              Panel Simulasi Webhook Sandbox
            </span>

            <Button
              type="button"
              onClick={handleSuccess}
              isLoading={isProcessing}
              className="w-full h-11 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold gap-2 rounded-xl shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simulasikan Pembayaran Berhasil (Lunas)</span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onSimulateCancel}
                disabled={isProcessing}
                className="h-9 text-[11px] font-semibold text-red-600 border-red-200 hover:bg-red-50 gap-1 rounded-xl"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Simulasi Batal / Expired</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isProcessing}
                className="h-9 text-[11px] font-semibold text-[#6d7a72] hover:bg-slate-100 rounded-xl"
              >
                Tutup Sementara
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
