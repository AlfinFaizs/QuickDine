import crypto from "crypto";

export interface CreateSnapTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface MidtransWebhookPayload {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  gross_amount: string;
  fraud_status?: string;
}

export class MidtransPaymentService {
  private serverKey: string;
  private isProduction: boolean;

  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  private get snapApiUrl(): string {
    return this.isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";
  }

  async createSnapToken(params: CreateSnapTransactionParams): Promise<{ token: string; redirectUrl: string }> {
    if (!this.serverKey) {
      console.warn("[Midtrans] Server key is missing. Returning mock snap token.");
      return {
        token: `mock_snap_${params.orderId}`,
        redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_${params.orderId}`,
      };
    }

    const authHeader = Buffer.from(`${this.serverKey}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: {
        first_name: params.customerName,
        phone: params.customerPhone,
        email: params.customerEmail || "customer@quickdine.id",
      },
      item_details: params.items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name.substring(0, 50),
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/orders/${params.orderId}`,
      },
    };

    const response = await fetch(this.snapApiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Midtrans] Create Snap Token Failed: ${errorText}`);
    }

    const data = await response.json();
    return {
      token: data.token,
      redirectUrl: data.redirect_url,
    };
  }

  verifySignature(payload: MidtransWebhookPayload): boolean {
    if (!this.serverKey) return false;
    const rawString = `${payload.order_id}${payload.status_code}${payload.gross_amount}${this.serverKey}`;
    const calculatedSignature = crypto.createHash("sha512").update(rawString).digest("hex");
    return calculatedSignature === payload.signature_key;
  }
}

export const midtransService = new MidtransPaymentService();
