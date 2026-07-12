import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const submitContact = bridgedMutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  returns: v.id("contactMessages"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
    });
  },
});

export const submitVolunteer = bridgedMutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    skills: v.optional(v.string()),
    availability: v.optional(v.string()),
    domains: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  returns: v.id("volunteers"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("volunteers", {
      ...args,
      status: "NEW",
    });
  },
});

export const subscribeNewsletter = bridgedMutation({
  args: { name: v.string(), phone: v.string() },
  returns: v.union(v.id("newsletterSubscribers"), v.null()),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .unique();
    if (existing) return null;
    return await ctx.db.insert("newsletterSubscribers", args);
  },
});

export const listMessages = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("contactMessages").order("desc").collect(),
});

export const listVolunteers = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("volunteers").order("desc").collect(),
});

export const markMessageRead = bridgedMutation({
  args: { id: v.id("contactMessages") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
    return null;
  },
});

export const deleteMessage = bridgedMutation({
  args: { id: v.id("contactMessages") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const updateVolunteerStatus = bridgedMutation({
  args: {
    id: v.id("volunteers"),
    status: v.union(
      v.literal("NEW"),
      v.literal("REVIEWING"),
      v.literal("ACCEPTED"),
      v.literal("REJECTED")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return null;
  },
});
