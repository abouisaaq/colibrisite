import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const list = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => await ctx.db.query("projects").collect(),
});

export const create = bridgedMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    goalAmount: v.optional(v.number()),
    raisedAmount: v.number(),
    progress: v.number(),
    actionId: v.optional(v.id("actions")),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => await ctx.db.insert("projects", args),
});

export const update = bridgedMutation({
  args: {
    id: v.id("projects"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    goalAmount: v.optional(v.number()),
    raisedAmount: v.number(),
    progress: v.number(),
    actionId: v.optional(v.id("actions")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
