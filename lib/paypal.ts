import "server-only";
import { getPayPalCredentials } from "@/lib/paypal-credentials";

async function getPayPalApiBase(): Promise<string> {
  const { environment } = await getPayPalCredentials();
  return environment === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret } = await getPayPalCredentials();
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${await getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to get PayPal access token");
  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: number, currency = "EUR") {
  const token = await getAccessToken();
  const res = await fetch(`${await getPayPalApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: "Don - Les Colibris Porteurs d'Espoir",
        },
      ],
    }),
  });

  if (!res.ok) throw new Error("Failed to create PayPal order");
  return res.json();
}

export async function getPayPalOrder(orderId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${await getPayPalApiBase()}/v2/checkout/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch PayPal order");
  return res.json();
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${await getPayPalApiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Idempotent : déjà capturé → renvoyer le détail de la commande
  if (!res.ok) {
    const errBody = await res.text();
    if (res.status === 422 || /ORDER_ALREADY_CAPTURED|ALREADY_CAPTURED/i.test(errBody)) {
      return getPayPalOrder(orderId);
    }
    throw new Error("Failed to capture PayPal order");
  }
  return res.json();
}

export async function verifyPayPalWebhook(
  headers: Headers,
  body: string
): Promise<boolean> {
  const { webhookId } = await getPayPalCredentials();
  if (!webhookId) return false;

  try {
    const token = await getAccessToken();
    const res = await fetch(`${await getPayPalApiBase()}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}
