import "server-only";
import type { PayPalSetupStatus } from "@/lib/paypal-types";
import { getPayPalCredentials } from "@/lib/paypal-credentials";

export type { PayPalSetupStatus };

async function isSdkClientIdValid(
  clientId: string,
  environment: "sandbox" | "production"
): Promise<boolean> {
  const base =
    environment === "sandbox"
      ? "https://www.sandbox.paypal.com/sdk/js"
      : "https://www.paypal.com/sdk/js";
  const url = `${base}?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return (
      res.ok &&
      !text.includes("SDK Validation error") &&
      !text.includes("not recognized")
    );
  } catch {
    return false;
  }
}

async function areApiCredentialsValid(
  clientId: string,
  clientSecret: string,
  environment: "sandbox" | "production"
): Promise<boolean> {
  const apiBase =
    environment === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getPayPalSetupStatus(): Promise<PayPalSetupStatus> {
  const issues: string[] = [];
  const credentials = await getPayPalCredentials();
  const { clientId, clientSecret, environment, source } = credentials;

  if (!clientId) {
    issues.push(
      source === "cms"
        ? "Client ID PayPal manquant dans les paramètres du site"
        : "Client ID PayPal manquant (paramètres CMS ou .env)"
    );
  }
  if (!clientSecret) {
    issues.push(
      source === "cms"
        ? "Secret PayPal manquant dans les paramètres du site"
        : "Secret PayPal manquant (paramètres CMS ou .env)"
    );
  }

  if (clientId && clientSecret && issues.length === 0) {
    const [sdkValid, apiValid] = await Promise.all([
      isSdkClientIdValid(clientId, environment),
      areApiCredentialsValid(clientId, clientSecret, environment),
    ]);

    if (!sdkValid) {
      issues.push(
        "Le Client ID n'est pas reconnu par PayPal. Vérifiez qu'il correspond au mode sélectionné (sandbox ou live)."
      );
    }
    if (!apiValid) {
      issues.push("Le Secret PayPal est invalide ou ne correspond pas au Client ID.");
    }
  }

  return {
    ready: issues.length === 0,
    environment,
    issues,
  };
}
