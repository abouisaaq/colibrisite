import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

const testimonialType = v.union(
  v.literal("BENEFICIAIRE"),
  v.literal("BENEVOLE"),
  v.literal("DONATEUR"),
  v.literal("PARTENAIRE"),
  v.literal("ENSEIGNANT"),
  v.literal("MEDECIN")
);

const testimonialDoc = v.object({
  _id: v.id("testimonials"),
  _creationTime: v.number(),
  name: v.string(),
  role: v.optional(v.string()),
  quote: v.string(),
  type: testimonialType,
  iconKey: v.optional(v.string()),
  usePhoto: v.boolean(),
  imageUrl: v.optional(v.string()),
  order: v.number(),
  published: v.boolean(),
});

export const listPublished = bridgedQuery({
  args: { limit: v.optional(v.number()) },
  returns: v.array(testimonialDoc),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_published", (q) => q.eq("published", true))
      .take(args.limit ?? 20);
  },
});

export const listAll = bridgedQuery({
  args: {},
  returns: v.array(testimonialDoc),
  handler: async (ctx) => {
    return await ctx.db.query("testimonials").withIndex("by_order").collect();
  },
});

export const getById = bridgedQuery({
  args: { id: v.id("testimonials") },
  returns: v.union(testimonialDoc, v.null()),
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const create = bridgedMutation({
  args: {
    name: v.string(),
    role: v.optional(v.string()),
    quote: v.string(),
    type: testimonialType,
    iconKey: v.optional(v.string()),
    usePhoto: v.boolean(),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  },
  returns: v.id("testimonials"),
  handler: async (ctx, args) => await ctx.db.insert("testimonials", args),
});

export const update = bridgedMutation({
  args: {
    id: v.id("testimonials"),
    name: v.string(),
    role: v.optional(v.string()),
    quote: v.string(),
    type: testimonialType,
    iconKey: v.optional(v.string()),
    usePhoto: v.boolean(),
    imageUrl: v.optional(v.string()),
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
  args: { id: v.id("testimonials") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
