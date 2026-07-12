import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const listPublished = bridgedQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("partners"),
      _creationTime: v.number(),
      name: v.string(),
      logoUrl: v.string(),
      websiteUrl: v.optional(v.string()),
      order: v.number(),
      published: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("partners")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
  },
});

export const listAll = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("partners").withIndex("by_order").collect(),
});

export const getById = bridgedQuery({
  args: { id: v.id("partners") },
  returns: v.any(),
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const create = bridgedMutation({
  args: {
    name: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  },
  returns: v.id("partners"),
  handler: async (ctx, args) => await ctx.db.insert("partners", args),
});

export const update = bridgedMutation({
  args: {
    id: v.id("partners"),
    name: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("partners") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
