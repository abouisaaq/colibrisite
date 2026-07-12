import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message trop court"),
});

export const volunteerSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  skills: z.string().optional(),
  availability: z.string().optional(),
  domains: z.string().optional(),
  message: z.string().optional(),
});

export const articleSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(1).optional().default(""),
  content: z.string().min(10),
  imageUrl: z.string().optional(),
  category: z.string().default("Actualité"),
  published: z.boolean().default(false),
  /** Date d'affichage (YYYY-MM-DD) */
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export const eventTypeSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide (format #RRGGBB)")
    .default("#42D7C8"),
  order: z.number().default(0),
});

export const eventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  startDate: z.string(),
  endDate: z.string().optional(),
  imageUrl: z.string().optional(),
  eventTypeId: z.string().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).default("UPCOMING"),
});

export const actionSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  icon: z.string().default("heart"),
  order: z.number().default(0),
  imageUrl: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().optional(),
  goalAmount: z.number().optional(),
  raisedAmount: z.number().default(0),
  progress: z.number().min(0).max(100).default(0),
  actionId: z.string().optional(),
});

export const albumSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

export const donationSchema = z.object({
  amount: z.number().min(1),
  frequency: z.enum(["ONE_TIME", "MONTHLY"]),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
});

export const testimonialSchema = z
  .object({
    name: z.string().min(2),
    role: z.string().nullish(),
    quote: z.string().min(10),
    type: z
      .enum(["BENEFICIAIRE", "BENEVOLE", "DONATEUR", "PARTENAIRE", "ENSEIGNANT", "MEDECIN"])
      .default("BENEFICIAIRE"),
    iconKey: z.string().nullish(),
    usePhoto: z.coerce.boolean().default(false),
    imageUrl: z.string().nullish(),
    order: z.coerce.number().default(0),
    published: z.coerce.boolean().default(true),
  })
  .refine((data) => !data.usePhoto || Boolean(data.imageUrl?.trim()), {
    message: "Ajoutez une photo ou une URL d'image",
    path: ["imageUrl"],
  });

export const partnerSchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().min(1),
  websiteUrl: z.string().optional(),
  order: z.number().default(0),
  published: z.boolean().default(true),
});

export const whatsappSubscriptionSchema = z.object({
  name: z.string().min(2, "Veuillez entrer votre nom").max(80),
  phone: z
    .string()
    .min(9, "Numéro trop court")
    .max(20, "Numéro trop long")
    .regex(/^\+?[\d\s().-]+$/, "Format de numéro invalide"),
});

/** @deprecated Utiliser whatsappSubscriptionSchema */
export const newsletterSchema = whatsappSubscriptionSchema;
