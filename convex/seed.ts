import { v } from "convex/values";
import { bridgedMutation } from "./lib/bridgeAuth";

/**
 * Seed initial admin + default settings.
 * Call from scripts/seed-convex.ts after hashing the password with bcrypt.
 */
export const bootstrap = bridgedMutation({
  args: {
    adminEmail: v.string(),
    adminName: v.string(),
    adminPasswordHash: v.string(),
    settings: v.record(v.string(), v.string()),
  },
  returns: v.object({
    adminCreated: v.boolean(),
    settingsUpserted: v.number(),
  }),
  handler: async (ctx, args) => {
    let adminCreated = false;
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.adminEmail))
      .unique();

    if (!existingAdmin) {
      await ctx.db.insert("users", {
        email: args.adminEmail,
        name: args.adminName,
        passwordHash: args.adminPasswordHash,
        role: "ADMIN",
      });
      adminCreated = true;
    }

    let settingsUpserted = 0;
    for (const [key, value] of Object.entries(args.settings)) {
      const existing = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert("siteSettings", { key, value });
      }
      settingsUpserted += 1;
    }

    return { adminCreated, settingsUpserted };
  },
});
