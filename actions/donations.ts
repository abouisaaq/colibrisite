"use server";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { capturePayPalOrder } from "@/lib/paypal";
import { revalidatePath } from "next/cache";

type CapturePayload = {
  status?: string;
  purchase_units?: Array<{
    amount?: { value?: string; currency_code?: string };
    payments?: {
      captures?: Array<{
        status?: string;
        amount?: { value?: string; currency_code?: string };
      }>;
    };
  }>;
  payer?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
};

/**
 * Confirme un paiement PayPal après approval côté client.
 * Capture auprès de PayPal puis marque/crée le don COMPLETED lié à l’order ID.
 */
export async function completeDonation(orderId: string) {
  if (!orderId || typeof orderId !== "string" || orderId.length > 64) {
    throw new Error("Commande PayPal invalide.");
  }

  const capture = (await capturePayPalOrder(orderId)) as CapturePayload;
  const captureUnit = capture.purchase_units?.[0]?.payments?.captures?.[0];
  const unitAmount = capture.purchase_units?.[0]?.amount;
  const captureStatus = captureUnit?.status;
  const orderOk =
    capture.status === "COMPLETED" || captureStatus === "COMPLETED";

  if (!orderOk) {
    throw new Error("Le paiement PayPal n’a pas pu être confirmé.");
  }

  const amount = parseFloat(
    captureUnit?.amount?.value ?? unitAmount?.value ?? "0"
  );
  const currency =
    captureUnit?.amount?.currency_code ?? unitAmount?.currency_code ?? "EUR";
  const email = capture.payer?.email_address;
  const name = [capture.payer?.name?.given_name, capture.payer?.name?.surname]
    .filter(Boolean)
    .join(" ");

  const client = getConvexClient();
  const existing = await client.query(api.donations.getByPaypalOrderId, {
    paypalOrderId: orderId,
  });

  await client.mutation(api.donations.ensureCompleted, {
    paypalOrderId: orderId,
    amount: amount > 0 ? amount : (existing?.amount ?? 0),
    currency,
    frequency: existing?.frequency === "MONTHLY" ? "MONTHLY" : "ONE_TIME",
    donorName: existing?.donorName ?? (name || undefined),
    donorEmail: existing?.donorEmail ?? email,
  });

  revalidatePath("/admin/dons");
  revalidatePath("/admin");
  return { paypalOrderId: orderId, amount, status: "COMPLETED" as const };
}
