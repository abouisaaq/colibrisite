import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const list = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("newsletterSubscribers").order("desc").collect(),
});

export const remove = bridgedMutation({
  args: { id: v.id("newsletterSubscribers") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const subscribe = bridgedMutation({
  args: { name: v.string(), phone: v.string() },
  returns: v.object({
    created: v.boolean(),
    alreadyExists: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .unique();
    if (existing) {
      if (!existing.name && args.name) {
        await ctx.db.patch(existing._id, { name: args.name });
      }
      return { created: false, alreadyExists: true };
    }
    await ctx.db.insert("newsletterSubscribers", args);
    return { created: true, alreadyExists: false };
  },
});
