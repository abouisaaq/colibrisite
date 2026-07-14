import { v } from "convex/values";
import { bridgedMutation, bridgedQuery } from "./lib/bridgeAuth";

export const listTypes = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) =>
    await ctx.db.query("eventTypes").withIndex("by_order").collect(),
});

export const listEvents = bridgedQuery({
  args: { status: v.optional(v.string()), limit: v.optional(v.number()) },
  returns: v.any(),
  handler: async (ctx, args) => {
    let events;
    if (args.status === "UPCOMING") {
      events = await ctx.db
        .query("events")
        .withIndex("by_status", (q) => q.eq("status", "UPCOMING"))
        .collect();
    } else {
      events = await ctx.db.query("events").order("desc").collect();
    }
    const withTypes = await Promise.all(
      events.map(async (event) => {
        const eventType = event.eventTypeId
          ? await ctx.db.get(event.eventTypeId)
          : null;
        return { ...event, eventType, id: event._id };
      })
    );
    withTypes.sort((a, b) => b.startDate - a.startDate);
    return args.limit ? withTypes.slice(0, args.limit) : withTypes;
  },
});

export const getEventById = bridgedQuery({
  args: { id: v.id("events") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;
    const eventType = event.eventTypeId
      ? await ctx.db.get(event.eventTypeId)
      : null;
    return { ...event, eventType, id: event._id };
  },
});

export const createEvent = bridgedMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    location: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    eventTypeId: v.optional(v.id("eventTypes")),
    status: v.union(
      v.literal("UPCOMING"),
      v.literal("ONGOING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
  },
  returns: v.id("events"),
  handler: async (ctx, args) => await ctx.db.insert("events", args),
});

export const updateEvent = bridgedMutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    location: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    eventTypeId: v.optional(v.id("eventTypes")),
    status: v.union(
      v.literal("UPCOMING"),
      v.literal("ONGOING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const removeEvent = bridgedMutation({
  args: { id: v.id("events") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const createType = bridgedMutation({
  args: { name: v.string(), color: v.string(), order: v.number() },
  returns: v.id("eventTypes"),
  handler: async (ctx, args) => await ctx.db.insert("eventTypes", args),
});

export const updateType = bridgedMutation({
  args: {
    id: v.id("eventTypes"),
    name: v.string(),
    color: v.string(),
    order: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return null;
  },
});

export const removeType = bridgedMutation({
  args: { id: v.id("eventTypes") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
