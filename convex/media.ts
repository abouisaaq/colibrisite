import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const list = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("media").order("desc").collect(),
});

export const generateUploadUrl = bridgedMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const saveUploaded = bridgedMutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
  },
  returns: v.object({
    id: v.id("media"),
    url: v.string(),
  }),
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Fichier introuvable après téléversement");
    const id = await ctx.db.insert("media", {
      filename: args.filename,
      url,
      mimeType: args.mimeType,
      size: args.size,
      storageId: args.storageId,
    });
    return { id, url };
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (row?.storageId) {
      await ctx.storage.delete(row.storageId);
    }
    await ctx.db.delete(args.id);
    return null;
  },
});
