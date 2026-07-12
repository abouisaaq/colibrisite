import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

const articleFields = {
  _id: v.id("articles"),
  _creationTime: v.number(),
  title: v.string(),
  slug: v.string(),
  excerpt: v.string(),
  content: v.string(),
  imageUrl: v.optional(v.string()),
  category: v.string(),
  published: v.boolean(),
  publishedAt: v.optional(v.number()),
  metaTitle: v.optional(v.string()),
  metaDesc: v.optional(v.string()),
};

function sortByPublishedAt<
  T extends { publishedAt?: number; _creationTime: number },
>(rows: T[]) {
  return [...rows].sort(
    (a, b) =>
      (b.publishedAt ?? b._creationTime) - (a.publishedAt ?? a._creationTime)
  );
}

export const listPublished = bridgedQuery({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object(articleFields)),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("articles")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    return sortByPublishedAt(rows).slice(0, args.limit ?? 50);
  },
});

export const listAll = bridgedQuery({
  args: {},
  returns: v.array(v.object(articleFields)),
  handler: async (ctx) => {
    const rows = await ctx.db.query("articles").collect();
    return sortByPublishedAt(rows);
  },
});

export const getBySlug = bridgedQuery({
  args: { slug: v.string() },
  returns: v.union(v.object(articleFields), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = bridgedQuery({
  args: { id: v.id("articles") },
  returns: v.union(v.object(articleFields), v.null()),
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
    publishedAt: v.number(),
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
    publishedAt: v.number(),
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
