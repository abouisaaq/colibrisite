export type PayPalEnvironment = "sandbox" | "production";

export function getPayPalEnvironment(): PayPalEnvironment {
  const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE?.toLowerCase();
  return mode === "live" || mode === "production" ? "production" : "sandbox";
}

export function getPayPalClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() || undefined;
}
