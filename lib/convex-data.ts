import "server-only";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";

function mapId<T extends { _id: string }>(row: T) {
  return { ...row, id: row._id };
}

export async function fetchHomePage() {
  return await getConvexClient().query(api.home.homePage, {});
}

export async function fetchArticles(publishedOnly = false) {
  const client = getConvexClient();
  const rows = publishedOnly
    ? await client.query(api.articles.listPublished, {})
    : await client.query(api.articles.listAll, {});
  return rows.map(mapId);
}

export async function fetchArticleBySlug(slug: string) {
  const row = await getConvexClient().query(api.articles.getBySlug, { slug });
  return row ? mapId(row) : null;
}

export async function fetchArticleById(id: string) {
  const row = await getConvexClient().query(api.articles.getById, {
    id: id as Id<"articles">,
  });
  return row ? mapId(row) : null;
}

export async function fetchActions() {
  const rows = await getConvexClient().query(api.actionsContent.list, {});
  return rows.map(mapId);
}

export async function fetchActionById(id: string) {
  const row = await getConvexClient().query(api.actionsContent.getById, {
    id: id as Id<"actions">,
  });
  return row ? mapId(row) : null;
}

export async function fetchTestimonials(publishedOnly = false) {
  const client = getConvexClient();
  const rows = publishedOnly
    ? await client.query(api.testimonials.listPublished, {})
    : await client.query(api.testimonials.listAll, {});
  return rows.map(mapId);
}

export async function fetchTestimonialById(id: string) {
  const row = await getConvexClient().query(api.testimonials.getById, {
    id: id as Id<"testimonials">,
  });
  return row ? mapId(row) : null;
}

export async function fetchPartners(publishedOnly = false) {
  const client = getConvexClient();
  const rows = publishedOnly
    ? await client.query(api.partners.listPublished, {})
    : await client.query(api.partners.listAll, {});
  return rows.map(mapId);
}

export async function fetchPartnerById(id: string) {
  const row = await getConvexClient().query(api.partners.getById, {
    id: id as Id<"partners">,
  });
  return row ? mapId(row) : null;
}

export async function fetchGalleryAlbums() {
  return await getConvexClient().query(api.gallery.listAlbums, {});
}

export async function fetchGalleryAlbumBySlug(slug: string) {
  return await getConvexClient().query(api.gallery.getAlbumBySlug, { slug });
}

export async function fetchGalleryAlbumById(id: string) {
  return await getConvexClient().query(api.gallery.getAlbumById, {
    id: id as Id<"galleryAlbums">,
  });
}

export async function fetchEvents(opts?: { status?: string; limit?: number }) {
  return await getConvexClient().query(api.events.listEvents, {
    status: opts?.status,
    limit: opts?.limit,
  });
}

export async function fetchEventById(id: string) {
  return await getConvexClient().query(api.events.getEventById, {
    id: id as Id<"events">,
  });
}

export async function fetchEventTypes() {
  const rows = await getConvexClient().query(api.events.listTypes, {});
  return rows.map(mapId);
}

export async function fetchMedia() {
  const rows = await getConvexClient().query(api.media.list, {});
  return rows.map(mapId);
}

export async function fetchUsers() {
  const rows = await getConvexClient().query(api.users.list, {});
  return rows.map(mapId);
}

export async function fetchMessages() {
  const rows = await getConvexClient().query(api.publicForms.listMessages, {});
  return rows.map(mapId);
}

export async function fetchVolunteers() {
  const rows = await getConvexClient().query(api.publicForms.listVolunteers, {});
  return rows.map(mapId);
}

export async function fetchDonations() {
  const rows = await getConvexClient().query(api.donations.list, {});
  return rows.map(mapId);
}

export async function fetchNewsletter() {
  const rows = await getConvexClient().query(api.newsletter.list, {});
  return rows.map(mapId);
}
