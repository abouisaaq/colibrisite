export type DeviceType = "MOBILE" | "TABLET" | "DESKTOP" | "UNKNOWN";

export type ParsedUserAgent = {
  deviceType: DeviceType;
  browser: string;
  os: string;
};

export type GeoLocation = {
  country: string | null;
  countryCode: string | null;
  city: string | null;
};

const BOT_PATTERN =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|wget|curl|headless|lighthouse|preview/i;

export function isBotUserAgent(userAgent: string): boolean {
  return BOT_PATTERN.test(userAgent);
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const ua = userAgent || "";

  const isTablet = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua);
  const isMobile = /Mobile|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  let deviceType: DeviceType = "DESKTOP";
  if (isTablet) deviceType = "TABLET";
  else if (isMobile) deviceType = "MOBILE";

  let browser = "Autre";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  let os = "Autre";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return { deviceType, browser, os };
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

export async function resolveGeo(ip: string | null): Promise<GeoLocation> {
  if (!ip || isPrivateIp(ip)) {
    return { country: null, countryCode: null, city: null };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,city`,
      { signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return { country: null, countryCode: null, city: null };
    }

    const data = (await res.json()) as {
      status?: string;
      country?: string;
      countryCode?: string;
      city?: string;
    };

    if (data.status !== "success") {
      return { country: null, countryCode: null, city: null };
    }

    return {
      country: data.country ?? null,
      countryCode: data.countryCode ?? null,
      city: data.city ?? null,
    };
  } catch {
    return { country: null, countryCode: null, city: null };
  }
}

export function parseVisitorCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("colibri_vid="));

  if (!match) return null;
  const value = match.slice("colibri_vid=".length);
  return value || null;
}

export const DEVICE_LABELS: Record<DeviceType, string> = {
  MOBILE: "Mobile",
  TABLET: "Tablette",
  DESKTOP: "Ordinateur",
  UNKNOWN: "Inconnu",
};
