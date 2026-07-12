"use server";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { whatsappSubscriptionSchema } from "@/lib/validations";

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("0")) return `+33${cleaned.slice(1)}`;
  return `+${cleaned}`;
}

export async function subscribeWhatsApp(input: { name: string; phone: string }) {
  const parsed = whatsappSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Veuillez vérifier vos informations.",
    };
  }

  const normalized = normalizePhone(parsed.data.phone);
  const name = parsed.data.name.trim();
  const client = getConvexClient();
  const result = await client.mutation(api.newsletter.subscribe, {
    name,
    phone: normalized,
  });

  if (result.alreadyExists) {
    return {
      success: true,
      message:
        "Ce numéro est déjà inscrit. Vous recevrez nos prochaines actualités sur WhatsApp.",
    };
  }

  return {
    success: true,
    message: "Merci ! Vous recevrez bientôt nos nouveautés sur WhatsApp.",
  };
}

/** @deprecated Utiliser subscribeWhatsApp */
export async function subscribeNewsletter(email: string) {
  return subscribeWhatsApp({ name: "Inscrit", phone: email });
}
