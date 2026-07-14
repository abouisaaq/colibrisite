import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const listAlbums = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const albums = await ctx.db.query("galleryAlbums").order("desc").collect();
    return await Promise.all(
      albums.map(async (album) => {
        const images = await ctx.db
          .query("galleryImages")
          .withIndex("by_album", (q) => q.eq("albumId", album._id))
          .collect();
        return { ...album, images, id: album._id };
      })
    );
  },
});

export const getAlbumBySlug = bridgedQuery({
  args: { slug: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    const album = await ctx.db
      .query("galleryAlbums")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!album) return null;
    const images = await ctx.db
      .query("galleryImages")
      .withIndex("by_album", (q) => q.eq("albumId", album._id))
      .collect();
    return { ...album, images, id: album._id };
  },
});

export const getAlbumById = bridgedQuery({
  args: { id: v.id("galleryAlbums") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const album = await ctx.db.get(args.id);
    if (!album) return null;
    const images = await ctx.db
      .query("galleryImages")
      .withIndex("by_album", (q) => q.eq("albumId", album._id))
      .collect();
    return { ...album, images, id: album._id };
  },
});

export const createAlbum = bridgedMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
  },
  returns: v.id("galleryAlbums"),
  handler: async (ctx, args) => await ctx.db.insert("galleryAlbums", args),
});

export const updateAlbum = bridgedMutation({
  args: {
    id: v.id("galleryAlbums"),
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const removeAlbum = bridgedMutation({
  args: { id: v.id("galleryAlbums") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("galleryImages")
      .withIndex("by_album", (q) => q.eq("albumId", args.id))
      .collect();
    for (const image of images) {
      await ctx.db.delete(image._id);
    }
    await ctx.db.delete(args.id);
    return null;
  },
});

export const addImage = bridgedMutation({
  args: {
    albumId: v.id("galleryAlbums"),
    url: v.string(),
    alt: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    kind: v.optional(v.union(v.literal("photo"), v.literal("video"))),
    mimeType: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
  },
  returns: v.id("galleryImages"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("galleryImages")
      .withIndex("by_album", (q) => q.eq("albumId", args.albumId))
      .collect();
    const kind =
      args.kind ??
      (args.mimeType?.startsWith("video/") ? "video" : "photo");
    return await ctx.db.insert("galleryImages", {
      albumId: args.albumId,
      url: args.url,
      alt: args.alt,
      order: existing.length,
      storageId: args.storageId,
      kind,
      mimeType: args.mimeType,
      posterUrl: args.posterUrl,
    });
  },
});

export const removeImage = bridgedMutation({
  args: { id: v.id("galleryImages") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
