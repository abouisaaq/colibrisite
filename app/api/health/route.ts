import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";

export async function GET() {
  try {
    const client = getConvexClient();
    await client.query(api.siteVisits.ping, {});
    return Response.json({ status: "ok", database: "convex" });
  } catch {
    return Response.json(
      { status: "error", database: "disconnected" },
      { status: 503 }
    );
  }
}
