"use server";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { requireAdmin, requireAuth } from "@/lib/auth-utils";
import {
  articleSchema,
  eventSchema,
  eventTypeSchema,
  actionSchema,
  projectSchema,
  albumSchema,
  userSchema,
  testimonialSchema,
  partnerSchema,
} from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import {
  MAX_SITE_LOGO_HEIGHT,
  MIN_SITE_LOGO_HEIGHT,
  parseSiteLogoHeight,
} from "@/lib/logo-size";
import {
  MISSION_IMAGE_SETTING_KEYS,
  type MissionImageSlot,
} from "@/lib/mission-images";
import {
  SITE_PAGE_IMAGE_SLOTS,
  type SitePageImageSlot,
} from "@/lib/site-images";

function client() {
  return getConvexClient();
}

async function upsertSetting(key: string, value: string) {
  await client().mutation(api.settings.upsert, { key, value });
}

export async function saveSettings(settings: Record<string, string>) {
  await requireAdmin();
  await client().mutation(api.settings.upsertMany, { settings });
  revalidatePath("/");
  revalidatePath("/a-propos");
  revalidatePath("/faire-un-don");
  revalidatePath("/contact");
  revalidatePath("/benevole");
  revalidatePath("/admin/parametres");
  return { success: true };
}

export async function createArticle(data: unknown) {
  await requireAuth();
  const parsed = articleSchema.parse(data);
  const [year, month, day] = parsed.publishedAt.split("-").map(Number);
  const publishedAt = new Date(year!, month! - 1, day!, 12, 0, 0).getTime();
  const id = await client().mutation(api.articles.create, {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: parsed.content,
    category: parsed.category,
    published: parsed.published,
    publishedAt,
    imageUrl: parsed.imageUrl || undefined,
    metaTitle: parsed.metaTitle || undefined,
    metaDesc: parsed.metaDesc || undefined,
  });
  revalidatePath("/actualites");
  revalidatePath("/admin/articles");
  return { id };
}

export async function updateArticle(id: string, data: unknown) {
  await requireAuth();
  const parsed = articleSchema.parse(data);
  const [year, month, day] = parsed.publishedAt.split("-").map(Number);
  const publishedAt = new Date(year!, month! - 1, day!, 12, 0, 0).getTime();
  await client().mutation(api.articles.update, {
    id: id as Id<"articles">,
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: parsed.content,
    category: parsed.category,
    published: parsed.published,
    publishedAt,
    imageUrl: parsed.imageUrl || undefined,
    metaTitle: parsed.metaTitle || undefined,
    metaDesc: parsed.metaDesc || undefined,
  });
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${parsed.slug}`);
  revalidatePath("/admin/articles");
  return { id, slug: parsed.slug };
}

export async function deleteArticle(id: string) {
  await requireAuth();
  await client().mutation(api.articles.remove, { id: id as Id<"articles"> });
  revalidatePath("/actualites");
  revalidatePath("/admin/articles");
}

export async function createEvent(data: unknown) {
  await requireAuth();
  const parsed = eventSchema.parse(data);
  const id = await client().mutation(api.events.createEvent, {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    location: parsed.location,
    startDate: new Date(parsed.startDate).getTime(),
    endDate: parsed.endDate ? new Date(parsed.endDate).getTime() : undefined,
    imageUrl: parsed.imageUrl || undefined,
    eventTypeId: parsed.eventTypeId
      ? (parsed.eventTypeId as Id<"eventTypes">)
      : undefined,
    status: parsed.status,
  });
  revalidatePath("/");
  revalidatePath("/evenements");
  revalidatePath("/admin/evenements");
  return { id };
}

export async function updateEvent(id: string, data: unknown) {
  await requireAuth();
  const parsed = eventSchema.parse(data);
  await client().mutation(api.events.updateEvent, {
    id: id as Id<"events">,
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    location: parsed.location,
    startDate: new Date(parsed.startDate).getTime(),
    endDate: parsed.endDate ? new Date(parsed.endDate).getTime() : undefined,
    imageUrl: parsed.imageUrl || undefined,
    eventTypeId: parsed.eventTypeId
      ? (parsed.eventTypeId as Id<"eventTypes">)
      : undefined,
    status: parsed.status,
  });
  revalidatePath("/");
  revalidatePath("/evenements");
  revalidatePath("/admin/evenements");
  return { id };
}

export async function deleteEvent(id: string) {
  await requireAuth();
  await client().mutation(api.events.removeEvent, { id: id as Id<"events"> });
  revalidatePath("/");
  revalidatePath("/evenements");
  revalidatePath("/admin/evenements");
}

export async function createEventType(data: unknown) {
  await requireAuth();
  const parsed = eventTypeSchema.parse(data);
  const id = await client().mutation(api.events.createType, parsed);
  revalidatePath("/admin/types-evenements");
  revalidatePath("/admin/evenements");
  return { id };
}

export async function updateEventType(id: string, data: unknown) {
  await requireAuth();
  const parsed = eventTypeSchema.parse(data);
  await client().mutation(api.events.updateType, {
    id: id as Id<"eventTypes">,
    ...parsed,
  });
  revalidatePath("/admin/types-evenements");
  revalidatePath("/admin/evenements");
  return { id };
}

export async function deleteEventType(id: string) {
  await requireAuth();
  await client().mutation(api.events.removeType, {
    id: id as Id<"eventTypes">,
  });
  revalidatePath("/admin/types-evenements");
}

export async function createAction(data: unknown) {
  await requireAuth();
  const parsed = actionSchema.parse(data);
  const id = await client().mutation(api.actionsContent.create, {
    ...parsed,
    imageUrl: parsed.imageUrl || undefined,
  });
  revalidatePath("/");
  revalidatePath("/admin/actions");
  return { id };
}

export async function updateAction(id: string, data: unknown) {
  await requireAuth();
  const parsed = actionSchema.parse(data);
  await client().mutation(api.actionsContent.update, {
    id: id as Id<"actions">,
    ...parsed,
    imageUrl: parsed.imageUrl || undefined,
  });
  revalidatePath("/");
  revalidatePath("/admin/actions");
  return { id };
}

export async function deleteAction(id: string) {
  await requireAuth();
  await client().mutation(api.actionsContent.remove, {
    id: id as Id<"actions">,
  });
  revalidatePath("/");
  revalidatePath("/admin/actions");
}

export async function createProject(data: unknown) {
  await requireAuth();
  const parsed = projectSchema.parse(data);
  const id = await client().mutation(api.projects.create, {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    imageUrl: parsed.imageUrl || undefined,
    goalAmount: parsed.goalAmount,
    raisedAmount: parsed.raisedAmount ?? 0,
    progress: parsed.progress ?? 0,
    actionId: parsed.actionId
      ? (parsed.actionId as Id<"actions">)
      : undefined,
  });
  revalidatePath("/admin/actions");
  return { id };
}

export async function updateProject(id: string, data: unknown) {
  await requireAuth();
  const parsed = projectSchema.parse(data);
  await client().mutation(api.projects.update, {
    id: id as Id<"projects">,
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    imageUrl: parsed.imageUrl || undefined,
    goalAmount: parsed.goalAmount,
    raisedAmount: parsed.raisedAmount ?? 0,
    progress: parsed.progress ?? 0,
    actionId: parsed.actionId
      ? (parsed.actionId as Id<"actions">)
      : undefined,
  });
  revalidatePath("/admin/actions");
  return { id };
}

export async function deleteProject(id: string) {
  await requireAuth();
  await client().mutation(api.projects.remove, { id: id as Id<"projects"> });
  revalidatePath("/admin/actions");
}

export async function createAlbum(data: unknown) {
  await requireAuth();
  const parsed = albumSchema.parse(data);
  const id = await client().mutation(api.gallery.createAlbum, {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description || undefined,
    coverUrl: parsed.coverUrl || undefined,
  });
  revalidatePath("/galerie");
  revalidatePath("/admin/galerie");
  return { id };
}

export async function updateAlbum(id: string, data: unknown) {
  await requireAuth();
  const parsed = albumSchema.parse(data);
  await client().mutation(api.gallery.updateAlbum, {
    id: id as Id<"galleryAlbums">,
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description || undefined,
    coverUrl: parsed.coverUrl || undefined,
  });
  revalidatePath("/galerie");
  revalidatePath("/admin/galerie");
  return { id };
}

export async function deleteAlbum(id: string) {
  await requireAuth();
  await client().mutation(api.gallery.removeAlbum, {
    id: id as Id<"galleryAlbums">,
  });
  revalidatePath("/galerie");
  revalidatePath("/admin/galerie");
}

export async function addGalleryImage(albumId: string, url: string, alt?: string) {
  await requireAuth();
  await client().mutation(api.gallery.addImage, {
    albumId: albumId as Id<"galleryAlbums">,
    url,
    alt,
  });
  revalidatePath("/galerie");
  revalidatePath("/admin/galerie");
}

export async function deleteGalleryImage(id: string) {
  await requireAuth();
  await client().mutation(api.gallery.removeImage, {
    id: id as Id<"galleryImages">,
  });
  revalidatePath("/galerie");
  revalidatePath("/admin/galerie");
}

export async function updateVolunteerStatus(
  id: string,
  status: "NEW" | "REVIEWING" | "ACCEPTED" | "REJECTED"
) {
  await requireAuth();
  await client().mutation(api.publicForms.updateVolunteerStatus, {
    id: id as Id<"volunteers">,
    status,
  });
  revalidatePath("/admin/benevoles");
}

export async function markMessageRead(id: string) {
  await requireAuth();
  await client().mutation(api.publicForms.markMessageRead, {
    id: id as Id<"contactMessages">,
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAuth();
  await client().mutation(api.publicForms.deleteMessage, {
    id: id as Id<"contactMessages">,
  });
  revalidatePath("/admin/messages");
}

export async function createUser(data: unknown) {
  await requireAdmin();
  const parsed = userSchema.parse(data);
  if (!parsed.password) throw new Error("Mot de passe requis");
  const passwordHash = await bcrypt.hash(parsed.password, 12);
  const id = await client().mutation(api.users.create, {
    name: parsed.name,
    email: parsed.email,
    role: parsed.role,
    passwordHash,
  });
  revalidatePath("/admin/utilisateurs");
  return { id };
}

export async function deleteUser(id: string) {
  await requireAdmin();
  await client().mutation(api.users.remove, { id: id as Id<"users"> });
  revalidatePath("/admin/utilisateurs");
}

/** Upload image vers Convex File Storage */
export async function uploadFile(formData: FormData) {
  await requireAuth();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Aucun fichier sélectionné");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image (PNG, JPG, WebP, SVG…)");
  }

  const c = client();
  const uploadUrl = await c.mutation(api.media.generateUploadUrl, {});
  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!result.ok) {
    throw new Error("Échec du téléversement Convex");
  }
  const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const media = await c.mutation(api.media.saveUploaded, {
    storageId,
    filename,
    mimeType: file.type,
    size: file.size,
  });
  return { id: media.id, url: media.url, filename, mimeType: file.type, size: file.size, createdAt: Date.now() };
}

export async function uploadSiteLogo(formData: FormData) {
  await requireAdmin();
  const media = await uploadFile(formData);
  await upsertSetting("site_logo", media.url);
  revalidatePath("/");
  revalidatePath("/admin/medias");
  return media.url;
}

export async function removeSiteLogo() {
  await requireAdmin();
  await upsertSetting("site_logo", "");
  revalidatePath("/");
  revalidatePath("/admin/parametres");
  revalidatePath("/admin/medias");
}

export async function saveSiteLogoHeight(height: number) {
  await requireAdmin();
  const value = parseSiteLogoHeight(String(height));
  if (value < MIN_SITE_LOGO_HEIGHT || value > MAX_SITE_LOGO_HEIGHT) {
    throw new Error(
      `La taille doit être entre ${MIN_SITE_LOGO_HEIGHT} et ${MAX_SITE_LOGO_HEIGHT} px`
    );
  }
  await upsertSetting("site_logo_height", String(value));
  revalidatePath("/");
  revalidatePath("/admin/medias");
  return value;
}

export async function createTestimonial(data: unknown) {
  await requireAuth();
  const result = testimonialSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Données invalides");
  }
  const parsed = result.data;
  const id = await client().mutation(api.testimonials.create, {
    name: parsed.name,
    role: parsed.role?.trim() || undefined,
    quote: parsed.quote,
    type: parsed.type,
    iconKey: parsed.iconKey?.trim() || undefined,
    usePhoto: parsed.usePhoto,
    imageUrl: parsed.imageUrl?.trim() || undefined,
    order: parsed.order,
    published: parsed.published,
  });
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
  return { id };
}

export async function updateTestimonial(id: string, data: unknown) {
  await requireAuth();
  const result = testimonialSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Données invalides");
  }
  const parsed = result.data;
  await client().mutation(api.testimonials.update, {
    id: id as Id<"testimonials">,
    name: parsed.name,
    role: parsed.role?.trim() || undefined,
    quote: parsed.quote,
    type: parsed.type,
    iconKey: parsed.iconKey?.trim() || undefined,
    usePhoto: parsed.usePhoto,
    imageUrl: parsed.imageUrl?.trim() || undefined,
    order: parsed.order,
    published: parsed.published,
  });
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
  return { id };
}

export async function deleteTestimonial(id: string) {
  await requireAuth();
  await client().mutation(api.testimonials.remove, {
    id: id as Id<"testimonials">,
  });
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
}

export async function createPartner(data: unknown) {
  await requireAuth();
  const parsed = partnerSchema.parse(data);
  const id = await client().mutation(api.partners.create, {
    name: parsed.name,
    logoUrl: parsed.logoUrl,
    websiteUrl: parsed.websiteUrl || undefined,
    order: parsed.order,
    published: parsed.published,
  });
  revalidatePath("/");
  revalidatePath("/admin/partenaires");
  return { id };
}

export async function updatePartner(id: string, data: unknown) {
  await requireAuth();
  const parsed = partnerSchema.parse(data);
  await client().mutation(api.partners.update, {
    id: id as Id<"partners">,
    name: parsed.name,
    logoUrl: parsed.logoUrl,
    websiteUrl: parsed.websiteUrl || undefined,
    order: parsed.order,
    published: parsed.published,
  });
  revalidatePath("/");
  revalidatePath("/admin/partenaires");
  return { id };
}

export async function deletePartner(id: string) {
  await requireAuth();
  await client().mutation(api.partners.remove, { id: id as Id<"partners"> });
  revalidatePath("/");
  revalidatePath("/admin/partenaires");
}

export async function deleteNewsletterSubscriber(id: string) {
  await requireAuth();
  await client().mutation(api.newsletter.remove, {
    id: id as Id<"newsletterSubscribers">,
  });
  revalidatePath("/admin/newsletter");
}

export async function uploadMedia(formData: FormData) {
  const media = await uploadFile(formData);
  revalidatePath("/admin/medias");
  return media;
}

export async function uploadHeroImage(formData: FormData) {
  await requireAdmin();
  const media = await uploadFile(formData);
  await upsertSetting("hero_image", media.url);
  revalidatePath("/");
  revalidatePath("/admin/medias");
  revalidatePath("/admin/parametres");
  return media.url;
}

export async function removeHeroImage() {
  await requireAdmin();
  await upsertSetting("hero_image", "");
  revalidatePath("/");
  revalidatePath("/admin/medias");
  revalidatePath("/admin/parametres");
}

export async function uploadMissionImage(
  slot: MissionImageSlot,
  formData: FormData
) {
  await requireAdmin();
  const media = await uploadFile(formData);
  await upsertSetting(MISSION_IMAGE_SETTING_KEYS[slot], media.url);
  revalidatePath("/");
  revalidatePath("/admin/medias");
  return media.url;
}

export async function removeMissionImage(slot: MissionImageSlot) {
  await requireAdmin();
  await upsertSetting(MISSION_IMAGE_SETTING_KEYS[slot], "");
  revalidatePath("/");
  revalidatePath("/admin/medias");
}

export async function uploadSitePageImage(
  slot: SitePageImageSlot,
  formData: FormData
) {
  await requireAdmin();
  const key = SITE_PAGE_IMAGE_SLOTS[slot];
  if (!key) throw new Error("Emplacement image invalide");
  const media = await uploadFile(formData);
  await upsertSetting(key, media.url);
  revalidatePath("/");
  revalidatePath("/faire-un-don");
  revalidatePath("/a-propos");
  revalidatePath("/benevole");
  revalidatePath("/admin/medias");
  return media.url;
}

export async function removeSitePageImage(slot: SitePageImageSlot) {
  await requireAdmin();
  const key = SITE_PAGE_IMAGE_SLOTS[slot];
  if (!key) throw new Error("Emplacement image invalide");
  await upsertSetting(key, "");
  revalidatePath("/");
  revalidatePath("/faire-un-don");
  revalidatePath("/a-propos");
  revalidatePath("/benevole");
  revalidatePath("/admin/medias");
}

export async function saveAboutTeam(data: {
  intro: string;
  members: Array<{
    name: string;
    role: string;
    description: string;
    photoUrl?: string;
  }>;
}) {
  await requireAdmin();
  const intro = data.intro.trim();
  const members = data.members
    .map((member) => ({
      name: member.name.trim(),
      role: member.role.trim(),
      description: member.description.trim(),
      photoUrl: member.photoUrl?.trim() || undefined,
    }))
    .filter((member) => member.name && member.role)
    .slice(0, 6);

  if (members.length === 0) {
    throw new Error("Ajoutez au moins un membre avec un nom et un rôle");
  }

  await upsertSetting("about_team", intro);
  await upsertSetting("about_team_members", JSON.stringify(members));
  revalidatePath("/a-propos");
  revalidatePath("/admin/medias");
  revalidatePath("/admin/parametres");
  return { success: true };
}

export async function deleteMedia(id: string) {
  await requireAuth();
  await client().mutation(api.media.remove, { id: id as Id<"media"> });
  revalidatePath("/admin/medias");
}
