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
      galleryAlbums,
      galleryImages,
      spotlightVideoRows,
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
      ctx.db.query("galleryAlbums").order("desc").collect(),
      ctx.db.query("galleryImages").order("desc").take(80),
      ctx.db.query("homeSpotlightVideos").withIndex("by_order").collect(),
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

    // Médias galerie séparés : photos (frise) / vidéos (2 slots Accueil)
    const galleryPhotoMap = new Map<string, { id: string; url: string; alt: string }>();
    const galleryVideos: Array<{
      id: string;
      url: string;
      alt: string;
      posterUrl?: string;
    }> = [];

    for (const album of galleryAlbums) {
      const cover = album.coverUrl?.trim();
      if (cover) {
        galleryPhotoMap.set(cover, {
          id: `cover-${album._id}`,
          url: cover,
          alt: album.title,
        });
      }
    }
    for (const image of galleryImages) {
      const url = image.url?.trim();
      if (!url) continue;
      const kind =
        image.kind ??
        (image.mimeType?.startsWith("video/")
          ? "video"
          : /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)
            ? "video"
            : "photo");
      if (kind === "video") {
        galleryVideos.push({
          id: image._id,
          url,
          alt: image.alt?.trim() || "",
          posterUrl: image.posterUrl?.trim() || undefined,
        });
      } else {
        galleryPhotoMap.set(url, {
          id: image._id,
          url,
          alt: image.alt?.trim() || "",
        });
      }
    }
    const galleryPhotos = [...galleryPhotoMap.values()].slice(0, 48);

    /** Priorité : vidéos CMS Accueil, sinon vidéos galerie */
    const cmsSpotlightVideos = spotlightVideoRows
      .filter((row) => row.url?.trim() || row.youtubeUrl?.trim())
      .map((row) => ({
        id: row._id,
        url: row.url?.trim() || "",
        alt: row.title?.trim() || "",
        posterUrl: row.posterUrl?.trim() || undefined,
        youtubeUrl: row.youtubeUrl?.trim() || undefined,
      }));

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
      galleryPhotos,
      galleryVideos: galleryVideos.slice(0, 24),
      homeSpotlightVideos:
        cmsSpotlightVideos.length > 0
          ? cmsSpotlightVideos
          : galleryVideos.slice(0, 24),
    };
  },
});
