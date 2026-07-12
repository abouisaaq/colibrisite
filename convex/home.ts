import { v } from "convex/values";
import { bridgedQuery } from "./lib/bridgeAuth";

/** Données agrégées pour la page d'accueil (1 round-trip). */
export const homePage = bridgedQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const [
      settingsRows,
      actions,
      articles,
      events,
      testimonials,
      partners,
    ] = await Promise.all([
      ctx.db.query("siteSettings").collect(),
      ctx.db.query("actions").withIndex("by_order").collect(),
      ctx.db
        .query("articles")
        .withIndex("by_published", (q) => q.eq("published", true))
        .collect(),
      ctx.db
        .query("events")
        .withIndex("by_status", (q) => q.eq("status", "UPCOMING"))
        .take(8),
      ctx.db
        .query("testimonials")
        .withIndex("by_published", (q) => q.eq("published", true))
        .take(6),
      ctx.db
        .query("partners")
        .withIndex("by_published", (q) => q.eq("published", true))
        .collect(),
    ]);

    const settings: Record<string, string> = {};
    const secretKeys = new Set(["paypal_client_secret", "paypal_webhook_id"]);
    for (const row of settingsRows) {
      if (secretKeys.has(row.key)) continue;
      settings[row.key] = row.value;
    }

    const eventsWithTypes = await Promise.all(
      events.map(async (event) => ({
        ...event,
        id: event._id,
        eventType: event.eventTypeId
          ? await ctx.db.get(event.eventTypeId)
          : null,
      }))
    );
    eventsWithTypes.sort((a, b) => a.startDate - b.startDate);

    const sortedArticles = [...articles].sort(
      (a, b) =>
        (b.publishedAt ?? b._creationTime) - (a.publishedAt ?? a._creationTime)
    );

    return {
      settings,
      actions: actions.map((a) => ({ ...a, id: a._id })),
      articles: sortedArticles.slice(0, 4).map((a) => ({
        ...a,
        id: a._id,
      })),
      events: eventsWithTypes.slice(0, 4),
      testimonials: testimonials.map((t) => ({ ...t, id: t._id })),
      partners: partners.map((p) => ({ ...p, id: p._id })),
    };
  },
});
