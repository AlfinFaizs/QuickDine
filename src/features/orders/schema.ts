import { z } from "zod";

export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  customerPhone: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid")
    .max(16, "Nomor WhatsApp terlalu panjang")
    .regex(/^[0-9+]+$/, "Format nomor WhatsApp hanya boleh angka"),
  arrivalTime: z.string().min(1, "Jam kedatangan wajib dipilih"),
  paymentMethod: z.enum(["qris", "bca_va", "mandiri_va", "bri_va", "bni_va"], {
    message: "Pilih metode pembayaran yang valid",
  }),
  nonRefundableConsent: z.literal(true, {
    error: "Anda wajib menyetujui kebijakan non-refundable sebelum melanjutkan.",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
