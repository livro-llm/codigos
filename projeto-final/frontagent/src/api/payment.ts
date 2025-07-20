import api from "@/api/api";

interface CreateCheckoutSessionPayload {
  planId: number;
  assinatura: boolean;
}

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload
) {
  const response = await api.post("/payments/create-checkout-session", payload);
  return response.data as { sessionId: string };
}
