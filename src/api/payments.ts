import { apiRequest } from "./client";
import type { OrderApi } from "./orders";

export type PaymentMethod = "card" | "crypto";

export interface CreatePaymentItem {
  packageId: string;
  quantity: number;
}

export interface CreatePaymentPayload {
  method: PaymentMethod;
  items: CreatePaymentItem[];
  card?: {
    cardholder: string;
    number: string;
    expiry: string;
    cvc: string;
  };
  crypto?: {
    currency: string;
    network: string;
    txHash: string;
  };
}

export interface PaymentItemApi {
  id: number;
  paymentId: number;
  packageId: string;
  gameName: string;
  gameColor: string;
  item: string;
  amount: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentApi {
  id: number;
  userId: number;
  method: PaymentMethod;
  status: string;
  totalPrice: number;
  cardLast4?: string;
  cryptoCurrency?: string;
  cryptoNetwork?: string;
  cryptoTxHash?: string;
  createdAt: string;
  paidAt?: string;
  items: PaymentItemApi[];
}

export interface CreatePaymentResult {
  payment: PaymentApi;
  orders: OrderApi[];
}

export async function createPayment(
  payload: CreatePaymentPayload
): Promise<{ ok: boolean; data?: CreatePaymentResult; error?: string }> {
  return apiRequest<CreatePaymentResult>("/api/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
