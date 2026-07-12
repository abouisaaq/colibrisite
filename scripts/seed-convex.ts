/**
 * Seed Convex : admin + paramètres de base.
 * Usage: npx tsx scripts/seed-convex.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { api } from "../convex/_generated/api";
import { getConvexClient } from "../lib/convex";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    const hash = value.indexOf(" #");
    if (hash !== -1) value = value.slice(0, hash).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

async function main() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL manquant (.env.local)");
  }
  if (!process.env.CONVEX_BRIDGE_SECRET) {
    throw new Error("CONVEX_BRIDGE_SECRET manquant (.env.local)");
  }

  const client = getConvexClient();
  const passwordHash = await bcrypt.hash("admin123", 12);

  const result = await client.mutation(api.seed.bootstrap, {
    adminEmail: "admin@colibris.org",
    adminName: "Administrateur",
    adminPasswordHash: passwordHash,
    settings: {
      hero_title: "Porter l'espoir là où tout semble perdu",
      hero_subtitle:
        "Comme le colibri qui fait sa part, nous croyons que chaque geste compte.",
      mission_title: "Notre Mission",
      mission_text:
        "Nous agissons pour soutenir les familles les plus vulnérables, renforcer les liens entre les communautés et redonner espoir.",
      mission_quote: "Chaque geste, aussi petit soit-il, peut changer une vie.",
      cta_title: "Votre don, leur espoir",
      cta_subtitle:
        "En faisant un don, vous nous aidez à poursuivre nos actions et à changer des vies.",
      stat_families: "500",
      stat_volunteers: "100",
      stat_projects: "50",
      stat_partners: "15",
      contact_email: "contact@colibris-espoir.org",
      contact_phone_fr: "+33 1 23 45 67 89",
      contact_phone_ma: "+212 6 12 34 56 78",
      contact_address: "12 Rue de l'Espoir, 75011 Paris, France",
      seo_title: "Les Colibris Porteurs d'Espoir",
      seo_description:
        "Association caritative accompagnant les familles en difficulté.",
      newsletter_title: "Recevez nos nouveautés sur WhatsApp",
      newsletter_subtitle:
        "Inscrivez votre numéro pour recevoir nos actualités et l'impact de votre générosité.",
      partners_title: "Ils nous font confiance",
      partners_subtitle:
        "Merci à nos partenaires et collaborateurs qui nous accompagnent au quotidien.",
      site_logo_height: "44",
    },
  });

  console.log("Seed Convex OK:", result);
  console.log("Admin: admin@colibris.org / admin123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
