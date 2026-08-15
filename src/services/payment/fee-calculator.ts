import { PaymentMethod } from "@/types";

export interface FeeCalculationResult {
  subtotal: number;
  platformFee: number;
  total: number;
}

/**
 * PRD v4.2 Bagian 10 Business Model:
 * - QRIS: Fee Rp 1.500
 * - Virtual Account (BCA, Mandiri, BRI, BNI): Fee Rp 5.500
 */
export function calculateOrderFee(
  subtotal: number,
  paymentMethod?: PaymentMethod | string | null
): FeeCalculationResult {
  let platformFee = 1500; // Default to QRIS fee

  if (paymentMethod && paymentMethod !== "qris") {
    platformFee = 5500; // Virtual Account flat customer fee
  }

  const total = subtotal + platformFee;

  return {
    subtotal,
    platformFee,
    total,
  };
}
