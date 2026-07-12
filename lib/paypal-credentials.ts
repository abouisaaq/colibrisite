import "server-only";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { getSettings } from "@/lib/settings";
import type { PayPalEnvironment } from "@/lib/paypal-types";

export type PayPalCredentials = {
  mode: "sandbox" | "live";
  environment: PayPalEnvironment;
  clientId: string;
  clientSecret: string;
  webhookId: string;
  source: "cms" | "env" | "none";
};

function resolveMode(value?: string): "sandbox" | "live" {
  const mode = value?.trim().toLowerCase();
  return mode === "live" || mode === "production" ? "live" : "sandbox";
}

/**
 * Résout les identifiants PayPal.
 * Les variables d’environnement priment sur le CMS (évite un Client ID CMS
 * incorrect qui bloque le bouton alors que le .env est valide).
 */
export async function getPayPalCredentials(): Promise<PayPalCredentials> {
  const cms = await getSettings([
    SETTING_KEYS.paypalMode,
    SETTING_KEYS.paypalClientId,
    SETTING_KEYS.paypalClientSecret,
    SETTING_KEYS.paypalWebhookId,
  ]);

  const cmsClientId = cms[SETTING_KEYS.paypalClientId]?.trim() ?? "";
  const cmsSecret = cms[SETTING_KEYS.paypalClientSecret]?.trim() ?? "";
  const cmsMode = resolveMode(cms[SETTING_KEYS.paypalMode]);
  const cmsWebhook = cms[SETTING_KEYS.paypalWebhookId]?.trim() ?? "";

  const envClientId =
    process.env.PAYPAL_CLIENT_ID?.trim() ??
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ??
    "";
  const envSecret = process.env.PAYPAL_CLIENT_SECRET?.trim() ?? "";
  const envMode = resolveMode(
    process.env.PAYPAL_MODE ?? process.env.NEXT_PUBLIC_PAYPAL_MODE
  );
  const envWebhook = process.env.PAYPAL_WEBHOOK_ID?.trim() ?? "";

  if (envClientId && envSecret) {
    return {
      mode: envMode,
      environment: envMode === "live" ? "production" : "sandbox",
      clientId: envClientId,
      clientSecret: envSecret,
      webhookId: envWebhook || cmsWebhook,
      source: "env",
    };
  }

  if (cmsClientId && cmsSecret) {
    return {
      mode: cmsMode,
      environment: cmsMode === "live" ? "production" : "sandbox",
      clientId: cmsClientId,
      clientSecret: cmsSecret,
      webhookId: cmsWebhook || envWebhook,
      source: "cms",
    };
  }

  return {
    mode: envMode || cmsMode,
    environment: (envMode || cmsMode) === "live" ? "production" : "sandbox",
    clientId: envClientId || cmsClientId,
    clientSecret: envSecret || cmsSecret,
    webhookId: envWebhook || cmsWebhook,
    source: "none",
  };
}
