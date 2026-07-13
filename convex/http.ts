import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const MAX_HTTP_UPLOAD_BYTES = 20 * 1024 * 1024;

const http = httpRouter();

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin");
  return {
    // L’auth réelle est le ticket signé — on reflète l’Origin pour Safari/CORS.
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Upload-Ticket",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyTicket(secret: string, ticket: string): Promise<boolean> {
  const [expStr, sig] = ticket.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await hmacSha256Hex(secret, `upload:${exp}`);
  return expected === sig;
}

http.route({
  path: "/uploadMedia",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }),
});

http.route({
  path: "/uploadMedia",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const headers = corsHeaders(request);
    const secret = process.env.CONVEX_BRIDGE_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: "Config manquante" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const ticket = request.headers.get("X-Upload-Ticket") ?? "";
    if (!(await verifyTicket(secret, ticket))) {
      return new Response(JSON.stringify({ error: "Ticket invalide ou expiré" }), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const contentType =
      request.headers.get("Content-Type")?.split(";")[0]?.trim() ||
      "application/octet-stream";
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Fichier vide" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
    if (buffer.byteLength > MAX_HTTP_UPLOAD_BYTES) {
      return new Response(
        JSON.stringify({
          error: "Fichier trop volumineux pour cet envoi (max 20 Mo)",
        }),
        {
          status: 413,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }

    const blob = new Blob([new Uint8Array(buffer)], { type: contentType });
    const storageId = await ctx.storage.store(blob);

    return new Response(JSON.stringify({ storageId }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }),
});

export default http;
