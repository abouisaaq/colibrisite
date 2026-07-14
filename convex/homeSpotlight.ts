import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const list = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("homeSpotlightVideos")
      .withIndex("by_order")
      .collect();
    return rows.map((row) => ({ ...row, id: row._id }));
  },
});

export const add = bridgedMutation({
  args: {
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    mimeType: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
  },
  returns: v.id("homeSpotlightVideos"),
  handler: async (ctx, args) => {
    const hasFile = !!args.url?.trim();
    const hasYoutube = !!args.youtubeUrl?.trim();
    if (!hasFile && !hasYoutube) {
      throw new Error("Une vidéo ou un lien YouTube est requis");
    }

    const existing = await ctx.db.query("homeSpotlightVideos").collect();
    const maxOrder = existing.reduce(
      (max, row) => Math.max(max, row.order),
      -1
    );

    return await ctx.db.insert("homeSpotlightVideos", {
      title: args.title?.trim() || undefined,
      url: args.url?.trim() || undefined,
      storageId: args.storageId,
      mimeType: args.mimeType,
      posterUrl: args.posterUrl?.trim() || undefined,
      youtubeUrl: args.youtubeUrl?.trim() || undefined,
      order: maxOrder + 1,
    });
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("homeSpotlightVideos") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
