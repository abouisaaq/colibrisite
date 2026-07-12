import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

const userPublicFields = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  email: v.string(),
  name: v.string(),
  role: v.union(v.literal("ADMIN"), v.literal("EDITOR")),
});

/** Réservé à NextAuth (serveur) — contient passwordHash. */
export const getByEmail = bridgedQuery({
  args: { email: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

/** Liste admin sans hashes. */
export const list = bridgedQuery({
  args: {},
  returns: v.array(userPublicFields),
  handler: async (ctx) => {
    const rows = await ctx.db.query("users").collect();
    return rows.map(({ passwordHash: _passwordHash, ...user }) => user);
  },
});

export const create = bridgedMutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("EDITOR")),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => await ctx.db.insert("users", args),
});

export const update = bridgedMutation({
  args: {
    id: v.id("users"),
    email: v.string(),
    name: v.string(),
    passwordHash: v.optional(v.string()),
    role: v.union(v.literal("ADMIN"), v.literal("EDITOR")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, passwordHash, ...rest } = args;
    if (passwordHash) {
      await ctx.db.patch(id, { ...rest, passwordHash });
    } else {
      await ctx.db.patch(id, rest);
    }
    return null;
  },
});

export const remove = bridgedMutation({
  args: { id: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
