import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

const deviceType = v.union(
  v.literal("MOBILE"),
  v.literal("TABLET"),
  v.literal("DESKTOP"),
  v.literal("UNKNOWN")
);

export const record = bridgedMutation({
  args: {
    visitorId: v.string(),
    path: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    deviceType,
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    country: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  returns: v.id("siteVisits"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("siteVisits", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listSince = bridgedQuery({
  args: { sinceMs: v.number() },
  returns: v.array(
    v.object({
      visitorId: v.string(),
      path: v.string(),
      deviceType,
      country: v.optional(v.string()),
      countryCode: v.optional(v.string()),
      city: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("siteVisits")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", args.sinceMs))
      .collect();

    return rows.map((row) => ({
      visitorId: row.visitorId,
      path: row.path,
      deviceType: row.deviceType,
      country: row.country,
      countryCode: row.countryCode,
      city: row.city,
      createdAt: row.createdAt,
    }));
  },
});

/** Ping léger pour /api/health */
export const ping = bridgedQuery({
  args: {},
  returns: v.literal("ok"),
  handler: async () => "ok" as const,
});
