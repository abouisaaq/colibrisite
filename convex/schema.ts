import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("EDITOR")),
  }).index("by_email", ["email"]),

  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    published: v.boolean(),
    metaTitle: v.optional(v.string()),
    metaDesc: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"]),

  eventTypes: defineTable({
    name: v.string(),
    color: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  events: defineTable({
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
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_startDate", ["startDate"]),

  actions: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    goalAmount: v.optional(v.number()),
    raisedAmount: v.number(),
    progress: v.number(),
    actionId: v.optional(v.id("actions")),
  }).index("by_slug", ["slug"]),

  galleryAlbums: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  galleryImages: defineTable({
    url: v.string(),
    alt: v.optional(v.string()),
    order: v.number(),
    albumId: v.id("galleryAlbums"),
    storageId: v.optional(v.id("_storage")),
  }).index("by_album", ["albumId"]),

  donations: defineTable({
    amount: v.number(),
    currency: v.string(),
    frequency: v.union(v.literal("ONE_TIME"), v.literal("MONTHLY")),
    status: v.union(
      v.literal("PENDING"),
      v.literal("COMPLETED"),
      v.literal("FAILED"),
      v.literal("CANCELLED")
    ),
    donorName: v.optional(v.string()),
    donorEmail: v.optional(v.string()),
    paypalOrderId: v.optional(v.string()),
    paypalSubId: v.optional(v.string()),
  })
    .index("by_paypalOrderId", ["paypalOrderId"])
    .index("by_status", ["status"]),

  volunteers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    skills: v.optional(v.string()),
    availability: v.optional(v.string()),
    domains: v.optional(v.string()),
    message: v.optional(v.string()),
    status: v.union(
      v.literal("NEW"),
      v.literal("REVIEWING"),
      v.literal("ACCEPTED"),
      v.literal("REJECTED")
    ),
  }).index("by_status", ["status"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
    read: v.boolean(),
  }).index("by_read", ["read"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  media: defineTable({
    filename: v.string(),
    url: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageId: v.optional(v.id("_storage")),
  }),

  testimonials: defineTable({
    name: v.string(),
    role: v.optional(v.string()),
    quote: v.string(),
    type: v.union(
      v.literal("BENEFICIAIRE"),
      v.literal("BENEVOLE"),
      v.literal("DONATEUR"),
      v.literal("PARTENAIRE"),
      v.literal("ENSEIGNANT"),
      v.literal("MEDECIN")
    ),
    iconKey: v.optional(v.string()),
    usePhoto: v.boolean(),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  })
    .index("by_published", ["published"])
    .index("by_order", ["order"]),

  newsletterSubscribers: defineTable({
    name: v.string(),
    phone: v.string(),
  }).index("by_phone", ["phone"]),

  partners: defineTable({
    name: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  })
    .index("by_published", ["published"])
    .index("by_order", ["order"]),

  siteVisits: defineTable({
    visitorId: v.string(),
    path: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    deviceType: v.union(
      v.literal("MOBILE"),
      v.literal("TABLET"),
      v.literal("DESKTOP"),
      v.literal("UNKNOWN")
    ),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    country: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    city: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_visitor", ["visitorId"])
    .index("by_country", ["country"])
    .index("by_deviceType", ["deviceType"])
    .index("by_createdAt", ["createdAt"]),
});
