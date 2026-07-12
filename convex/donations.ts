import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const list = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("donations").order("desc").collect(),
});

export const getByPaypalOrderId = bridgedQuery({
  args: { paypalOrderId: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("donations")
      .withIndex("by_paypalOrderId", (q) =>
        q.eq("paypalOrderId", args.paypalOrderId)
      )
      .unique();
  },
});

export const createPending = bridgedMutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    frequency: v.union(v.literal("ONE_TIME"), v.literal("MONTHLY")),
    donorName: v.optional(v.string()),
    donorEmail: v.optional(v.string()),
    paypalOrderId: v.string(),
  },
  returns: v.id("donations"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("donations")
      .withIndex("by_paypalOrderId", (q) =>
        q.eq("paypalOrderId", args.paypalOrderId)
      )
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert("donations", {
      ...args,
      status: "PENDING",
    });
  },
});

export const updateByPaypalOrder = bridgedMutation({
  args: {
    paypalOrderId: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("COMPLETED"),
      v.literal("FAILED"),
      v.literal("CANCELLED")
    ),
    paypalSubId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paypalOrderId", (q) =>
        q.eq("paypalOrderId", args.paypalOrderId)
      )
      .unique();
    if (!donation) return null;
    await ctx.db.patch(donation._id, {
      status: args.status,
      ...(args.paypalSubId ? { paypalSubId: args.paypalSubId } : {}),
    });
    return null;
  },
});

/** Marque COMPLETED, ou crée le don s’il n’existait pas encore. */
export const ensureCompleted = bridgedMutation({
  args: {
    paypalOrderId: v.string(),
    amount: v.number(),
    currency: v.string(),
    frequency: v.union(v.literal("ONE_TIME"), v.literal("MONTHLY")),
    donorName: v.optional(v.string()),
    donorEmail: v.optional(v.string()),
  },
  returns: v.id("donations"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("donations")
      .withIndex("by_paypalOrderId", (q) =>
        q.eq("paypalOrderId", args.paypalOrderId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "COMPLETED",
        amount: args.amount > 0 ? args.amount : existing.amount,
        ...(args.donorEmail ? { donorEmail: args.donorEmail } : {}),
        ...(args.donorName ? { donorName: args.donorName } : {}),
      });
      return existing._id;
    }

    return await ctx.db.insert("donations", {
      amount: args.amount,
      currency: args.currency,
      frequency: args.frequency,
      donorName: args.donorName,
      donorEmail: args.donorEmail,
      paypalOrderId: args.paypalOrderId,
      status: "COMPLETED",
    });
  },
});
