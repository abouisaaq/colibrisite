import { auth } from "@/lib/auth";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import {
  createMediaUploadTicket,
  getConvexSiteUrl,
} from "@/lib/upload-ticket";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_HTTP_UPLOAD_BYTES = 20 * 1024 * 1024;

/**
 * Prépare un envoi vidéo navigateur → Convex (évite les Server Actions + limite Vercel).
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const bridgeSecret = process.env.CONVEX_BRIDGE_SECRET;
  if (!bridgeSecret) {
    return NextResponse.json(
      { error: "CONVEX_BRIDGE_SECRET manquant" },
      { status: 500 }
    );
  }

  try {
    const storageUploadUrl = await getConvexClient().mutation(
      api.media.generateUploadUrl,
      {}
    );
    const siteUrl = getConvexSiteUrl();
    const ticket = createMediaUploadTicket(bridgeSecret);

    return NextResponse.json({
      ticket,
      httpUploadUrl: `${siteUrl}/uploadMedia`,
      storageUploadUrl,
      maxHttpBytes: MAX_HTTP_UPLOAD_BYTES,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Préparation impossible";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
