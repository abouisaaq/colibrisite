import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { getPayPalCredentials } from "@/lib/paypal-credentials";
import { verifyPayPalWebhook } from "@/lib/paypal";

export async function POST(request: Request) {
  const body = await request.text();
  const headers = request.headers;
  const { webhookId } = await getPayPalCredentials();

  // Fail-closed : sans webhook ID configuré, ou signature invalide → refus
  if (!webhookId) {
    console.error("PayPal webhook rejeté : PAYPAL_WEBHOOK_ID / paramètre manquant.");
    return NextResponse.json(
      { error: "Webhook PayPal non configuré." },
      { status: 503 }
    );
  }

  const verified = await verifyPayPalWebhook(headers, body);
  if (!verified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: {
    event_type?: string;
    resource?: {
      supplementary_data?: { related_ids?: { order_id?: string } };
      amount?: { value?: string; currency_code?: string };
      payer?: { email_address?: string };
    };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    const amount = parseFloat(event.resource?.amount?.value ?? "0");
    const email = event.resource?.payer?.email_address;

    if (orderId) {
      const client = getConvexClient();
      const existing = await client.query(api.donations.getByPaypalOrderId, {
        paypalOrderId: orderId,
      });

      await client.mutation(api.donations.ensureCompleted, {
        paypalOrderId: orderId,
        amount: amount > 0 ? amount : (existing?.amount ?? 0),
        currency: event.resource?.amount?.currency_code ?? "EUR",
        frequency: existing?.frequency === "MONTHLY" ? "MONTHLY" : "ONE_TIME",
        donorName: existing?.donorName,
        donorEmail: existing?.donorEmail ?? email,
      });
    }
  }

  return NextResponse.json({ received: true });
}
