import { createHmac, timingSafeEqual } from "crypto";

const TICKET_TTL_MS = 10 * 60 * 1000;

/** Ticket court pour autoriser un POST navigateur → Convex HTTP (pas le bridge secret). */
export function createMediaUploadTicket(secret: string, ttlMs = TICKET_TTL_MS): string {
  const exp = Date.now() + ttlMs;
  const sig = createHmac("sha256", secret).update(`upload:${exp}`).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyMediaUploadTicket(secret: string, ticket: string): boolean {
  const [expStr, sig] = ticket.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = createHmac("sha256", secret).update(`upload:${exp}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

export function getConvexSiteUrl(): string {
  const site = process.env.NEXT_PUBLIC_CONVEX_SITE_URL?.trim();
  if (site) return site.replace(/\/$/, "");
  const cloud = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!cloud) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL manquant");
  }
  return cloud.replace(/\.convex\.cloud$/, ".convex.site").replace(/\/$/, "");
}
