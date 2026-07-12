import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const list = bridgedQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("actions"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      description: v.string(),
      icon: v.string(),
      order: v.number(),
      imageUrl: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("actions").withIndex("by_order").collect();
  },
});

export const getById = bridgedQuery({
  args: { id: v.id("actions") },
  returns: v.any(),
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const create = bridgedMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("actions"),
  handler: async (ctx, args) => await ctx.db.insert("actions", args),
});

export const update = bridgedMutation({
  args: {
    id: v.id("actions"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("actions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
