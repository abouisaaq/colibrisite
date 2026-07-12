import { NextResponse } from "next/server";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { createPayPalOrder } from "@/lib/paypal";

const bodySchema = z.object({
  amount: z.number().min(1).max(100_000),
  donorName: z.string().trim().max(120).optional(),
  donorEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
});

/**
 * Crée la commande PayPal puis un don PENDING déjà lié à l’order ID.
 * Les dons mensuels récurrents ne sont pas encore supportés — uniquement ONE_TIME.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse({
      ...json,
      amount: typeof json.amount === "string" ? parseFloat(json.amount) : json.amount,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    const { amount, donorName } = parsed.data;
    const donorEmail = parsed.data.donorEmail || undefined;

    const order = await createPayPalOrder(amount);
    if (!order?.id) {
      return NextResponse.json(
        { error: "Réponse PayPal invalide." },
        { status: 502 }
      );
    }

    const client = getConvexClient();
    await client.mutation(api.donations.createPending, {
      amount,
      currency: "EUR",
      frequency: "ONE_TIME",
      donorName: donorName || undefined,
      donorEmail,
      paypalOrderId: order.id,
    });

    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "Impossible de créer la commande PayPal." },
      { status: 500 }
    );
  }
}
