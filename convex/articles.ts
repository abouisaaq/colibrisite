import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const listPublished = bridgedQuery({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("articles"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      content: v.string(),
      imageUrl: v.optional(v.string()),
      category: v.string(),
      published: v.boolean(),
      metaTitle: v.optional(v.string()),
      metaDesc: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("articles")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(args.limit ?? 50);
    return rows;
  },
});

export const listAll = bridgedQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("articles"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      content: v.string(),
      imageUrl: v.optional(v.string()),
      category: v.string(),
      published: v.boolean(),
      metaTitle: v.optional(v.string()),
      metaDesc: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("articles").order("desc").collect();
  },
});

export const getBySlug = bridgedQuery({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("articles"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      content: v.string(),
      imageUrl: v.optional(v.string()),
      category: v.string(),
      published: v.boolean(),
      metaTitle: v.optional(v.string()),
      metaDesc: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = bridgedQuery({
  args: { id: v.id("articles") },
  returns: v.union(
    v.object({
      _id: v.id("articles"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      content: v.string(),
      imageUrl: v.optional(v.string()),
      category: v.string(),
      published: v.boolean(),
      metaTitle: v.optional(v.string()),
      metaDesc: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = bridgedMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    published: v.boolean(),
    metaTitle: v.optional(v.string()),
    metaDesc: v.optional(v.string()),
  },
  returns: v.id("articles"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("articles", args);
  },
});

export const update = bridgedMutation({
  args: {
    id: v.id("articles"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    published: v.boolean(),
    metaTitle: v.optional(v.string()),
    metaDesc: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("articles") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
