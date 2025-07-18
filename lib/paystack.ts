// lib/paystack.ts
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error("Missing PAYSTACK_SECRET_KEY in environment variables");
}

const BASE_URL = "https://api.paystack.co";

export const Paystack = {
  async initializeTransaction({
    email,
    amount,
    metadata,
    callback_url,
  }: {
    email: string;
    amount: number; // in kobo
    metadata: Record<string, any>;
    callback_url?: string;
  }) {
    const res = await fetch(`${BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        metadata,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payment/success`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to initialize transaction");
    }

    return data;
  },

  async verifyTransaction(reference: string) {
    const res = await fetch(`${BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Transaction verification failed");
    }

    return data;
  },
};
