import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import {
  getClientIp,
  isBotUserAgent,
  parseUserAgent,
  parseVisitorCookie,
  resolveGeo,
} from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: string; referrer?: string };
    const path = body.path?.trim();

    if (!path || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    if (isBotUserAgent(userAgent)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const cookieHeader = request.headers.get("cookie");
    let visitorId = parseVisitorCookie(cookieHeader);
    const isNewVisitor = !visitorId;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    const { deviceType, browser, os } = parseUserAgent(userAgent);
    const geo = await resolveGeo(getClientIp(request));

    const client = getConvexClient();
    await client.mutation(api.siteVisits.record, {
      visitorId,
      path: path.slice(0, 500),
      referrer: body.referrer?.slice(0, 500) || undefined,
      userAgent: userAgent.slice(0, 500) || undefined,
      deviceType,
      browser,
      os,
      country: geo.country || undefined,
      countryCode: geo.countryCode || undefined,
      city: geo.city || undefined,
    });

    const response = NextResponse.json({ ok: true });

    if (isNewVisitor) {
      response.cookies.set("colibri_vid", visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
