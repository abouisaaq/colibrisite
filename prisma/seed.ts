import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@colibris.org";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const name = process.env.SEED_ADMIN_NAME ?? "Administrateur";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash, role: "ADMIN" },
  });

  const settings = [
    { key: "hero_title", value: "Porter l'espoir là où tout semble perdu" },
    {
      key: "hero_subtitle",
      value:
        "Comme le colibri qui fait sa part, nous croyons que chaque geste compte. Rejoignez notre communauté et ensemble, changeons des vies.",
    },
    {
      key: "hero_image",
      value:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=85",
    },
    { key: "mission_title", value: "Notre Mission" },
    {
      key: "mission_text",
      value:
        "Nous agissons pour soutenir les familles les plus vulnérables, renforcer les liens entre les communautés et redonner espoir grâce à des actions concrètes, humaines et durables.",
    },
    {
      key: "mission_quote",
      value: "Chaque geste, aussi petit soit-il, peut changer une vie.",
    },
    { key: "mission_image_main", value: "" },
    { key: "mission_image_left", value: "" },
    { key: "mission_image_right", value: "" },
    { key: "stat_families", value: "2500" },
    { key: "stat_volunteers", value: "180" },
    { key: "stat_projects", value: "45" },
    { key: "stat_partners", value: "32" },
    { key: "cta_title", value: "Ensemble, nous pouvons faire la différence" },
    {
      key: "cta_subtitle",
      value: "Rejoignez notre communauté de bénévoles et de donateurs pour porter l'espoir.",
    },
    {
      key: "newsletter_title",
      value: "Recevez nos nouveautés sur WhatsApp",
    },
    {
      key: "newsletter_subtitle",
      value:
        "Inscrivez votre numéro pour recevoir nos actualités, événements et l'impact de votre générosité directement sur WhatsApp.",
    },
    {
      key: "partners_title",
      value: "Ils nous font confiance",
    },
    {
      key: "partners_subtitle",
      value: "Merci à nos partenaires et collaborateurs qui nous accompagnent au quotidien.",
    },
    { key: "site_logo", value: "" },
    { key: "site_logo_height", value: "44" },
    {
      key: "about_mission",
      value:
        "Fondée sur les valeurs de solidarité et d'entraide, notre association œuvre chaque jour pour améliorer le quotidien des familles en situation de précarité.",
    },
    {
      key: "about_team",
      value:
        "Notre équipe est composée de bénévoles passionnés, de professionnels engagés et de partenaires institutionnels qui partagent notre vision d'un monde plus juste.",
    },
    {
      key: "about_values",
      value:
        "Solidarité, Transparence, Dignité, Engagement — ces valeurs guident chacune de nos actions sur le terrain.",
    },
    { key: "contact_email", value: "contact@colibris-espoir.org" },
    { key: "contact_phone_fr", value: "+33 1 23 45 67 89" },
    { key: "contact_phone_ma", value: "+212 6 12 34 56 78" },
    { key: "contact_address", value: "12 Rue de l'Espoir, 75011 Paris, France" },
    {
      key: "seo_title",
      value: "Les Colibris Porteurs d'Espoir — Association solidaire",
    },
    {
      key: "seo_description",
      value:
        "Association caritative accompagnant les familles en difficulté. Découvrez nos actions, actualités et comment nous soutenir.",
    },
    { key: "facebook_url", value: "https://facebook.com" },
    { key: "instagram_url", value: "https://instagram.com" },
    { key: "youtube_url", value: "https://youtube.com" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  const actions = [
    {
      title: "Aide alimentaire",
      slug: "aide-alimentaire",
      description:
        "Distribution de paniers alimentaires et repas chauds aux familles dans le besoin.",
      icon: "utensils",
      order: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=85",
    },
    {
      title: "Éducation",
      slug: "education",
      description:
        "Soutien scolaire, fournitures et accompagnement éducatif pour les enfants.",
      icon: "graduation-cap",
      order: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=85",
    },
    {
      title: "Santé",
      slug: "sante",
      description:
        "Accès aux soins, campagnes de prévention et accompagnement médical.",
      icon: "heart-pulse",
      order: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=85",
    },
    {
      title: "Logement",
      slug: "logement",
      description:
        "Aide au logement d'urgence et accompagnement vers un habitat stable.",
      icon: "home",
      order: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=85",
    },
    {
      title: "Culture & Loisirs",
      slug: "culture-loisirs",
      description:
        "Activités culturelles et sorties pour redonner le sourire aux enfants.",
      icon: "palette",
      order: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=85",
    },
    {
      title: "Accès à l'eau",
      slug: "acces-eau",
      description:
        "Installation de points d'eau potable et sensibilisation à l'hygiène dans les communautés isolées.",
      icon: "droplets",
      order: 6,
      imageUrl:
        "https://images.unsplash.com/photo-1548839140-29a7492991bd?w=900&q=85",
    },
  ];

  for (const a of actions) {
    await prisma.action.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }

  await prisma.action.deleteMany({ where: { slug: "insertion" } });

  const articles = [
    {
      title: "Grande distribution alimentaire de printemps",
      slug: "distribution-alimentaire-printemps",
      excerpt:
        "Plus de 500 familles ont bénéficié de notre distribution alimentaire ce week-end.",
      content:
        "<p>Ce samedi, nos bénévoles se sont mobilisés pour organiser une grande distribution alimentaire dans le quartier. Grâce à la générosité de nos partenaires, nous avons pu offrir des paniers complets à plus de 500 familles.</p><p>Un immense merci à tous les bénévoles qui ont rendu cet événement possible.</p>",
      category: "Événement",
      published: true,
      imageUrl:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    },
    {
      title: "Nouveau partenariat avec une école locale",
      slug: "partenariat-ecole-locale",
      excerpt:
        "Nous signons un partenariat pour le soutien scolaire de 120 enfants.",
      content:
        "<p>Nous sommes fiers d'annoncer notre nouveau partenariat avec l'école primaire du quartier. Ce programme permettra d'offrir un soutien scolaire gratuit à 120 enfants.</p>",
      category: "Partenariat",
      published: true,
      imageUrl:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    },
    {
      title: "Campagne de collecte de jouets",
      slug: "collecte-jouets",
      excerpt: "Collectons des jouets pour offrir un Noël magique aux enfants.",
      content:
        "<p>La campagne de collecte de jouets est lancée ! Déposez vos dons dans nos points de collecte partenaires jusqu'au 15 décembre.</p>",
      category: "Collecte",
      published: true,
      imageUrl:
        "https://images.unsplash.com/photo-1513884923967-4fa727a4b1f8?w=800&q=80",
    },
    {
      title: "Atelier parentalité : réussir la rentrée",
      slug: "atelier-parentalite-rentree",
      excerpt:
        "Un atelier gratuit pour accompagner les parents dans la préparation de la rentrée scolaire.",
      content:
        "<p>Nos équipes proposent un atelier convivial autour de la parentalité et de l'organisation de la rentrée. Inscriptions ouvertes aux familles accompagnées par l'association.</p>",
      category: "Atelier",
      published: true,
      imageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    },
  ];

  for (const art of articles) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }

  const now = new Date();
  const eventTypeSeeds = [
    { name: "Distribution", color: "#10B981", order: 0 },
    { name: "Atelier", color: "#3B82F6", order: 1 },
    { name: "Collecte", color: "#8B5CF6", order: 2 },
    { name: "Formation", color: "#F97316", order: 3 },
  ];

  const eventTypeMap: Record<string, string> = {};
  for (const type of eventTypeSeeds) {
    const record = await prisma.eventType.upsert({
      where: { name: type.name },
      update: type,
      create: type,
    });
    eventTypeMap[type.name] = record.id;
  }

  const events = [
    {
      title: "Journée portes ouvertes",
      slug: "journee-portes-ouvertes",
      description:
        "Venez découvrir nos locaux et rencontrer l'équipe de bénévoles.",
      location: "12 Rue de l'Espoir, Paris",
      startDate: new Date(now.getFullYear(), now.getMonth() + 1, 15, 10, 0),
      eventTypeId: eventTypeMap.Formation,
      imageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    },
    {
      title: "Marche solidaire",
      slug: "marche-solidaire",
      description:
        "Participez à notre marche solidaire de 10 km au profit des familles.",
      location: "Parc de la Villette, Paris",
      startDate: new Date(now.getFullYear(), now.getMonth() + 2, 8, 9, 0),
      eventTypeId: eventTypeMap.Collecte,
      imageUrl:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
    },
    {
      title: "Atelier cuisine solidaire",
      slug: "atelier-cuisine-solidaire",
      description:
        "Apprenez à cuisiner des repas nutritifs et économiques en famille.",
      location: "Centre communautaire, Paris 11e",
      startDate: new Date(now.getFullYear(), now.getMonth() + 1, 22, 14, 0),
      eventTypeId: eventTypeMap.Atelier,
      imageUrl:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    },
    {
      title: "Distribution alimentaire",
      slug: "distribution-alimentaire",
      description:
        "Distribution de paniers alimentaires aux familles accompagnées par l'association.",
      location: "Entrepôt solidaire, Paris 18e",
      startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 9, 0),
      eventTypeId: eventTypeMap.Distribution,
      imageUrl:
        "https://images.unsplash.com/photo-1488523787543-469f2f6f0b56?w=800&q=80",
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: ev,
      create: ev,
    });
  }

  const album = await prisma.galleryAlbum.upsert({
    where: { slug: "actions-terrain" },
    update: {},
    create: {
      title: "Actions sur le terrain",
      slug: "actions-terrain",
      description: "Photos de nos interventions auprès des familles",
      coverUrl:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    },
  });

  const images = [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  ];

  const existingImages = await prisma.galleryImage.count({
    where: { albumId: album.id },
  });
  if (existingImages === 0) {
    for (let i = 0; i < images.length; i++) {
      await prisma.galleryImage.create({
        data: {
          url: images[i],
          alt: `Photo ${i + 1}`,
          order: i,
          albumId: album.id,
        },
      });
    }
  }

  const album2 = await prisma.galleryAlbum.upsert({
    where: { slug: "evenements-2025" },
    update: {},
    create: {
      title: "Événements 2025",
      slug: "evenements-2025",
      description: "Retour en images sur nos événements",
      coverUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    },
  });

  const existingImages2 = await prisma.galleryImage.count({
    where: { albumId: album2.id },
  });
  if (existingImages2 === 0) {
    for (let i = 0; i < 4; i++) {
      await prisma.galleryImage.create({
        data: {
          url: images[i],
          alt: `Événement ${i + 1}`,
          order: i,
          albumId: album2.id,
        },
      });
    }
  }

  const testimonials = [
    {
      name: "Fatou D.",
      role: "Bénéficiaire",
      type: "BENEFICIAIRE" as const,
      quote: "Grâce aux Colibris, nous avons retrouvé espoir.",
      order: 1,
      published: true,
    },
    {
      name: "Thomas M.",
      role: "Bénévole",
      type: "BENEVOLE" as const,
      quote: "Donner de mon temps ici est la décision la plus enrichissante de ma vie.",
      order: 2,
      published: true,
    },
    {
      name: "Sophie L.",
      role: "Donatrice",
      type: "DONATEUR" as const,
      quote: "Je fais confiance à cette association pour son impact réel sur le terrain.",
      order: 3,
      published: true,
    },
    {
      name: "Dr. Amine K.",
      role: "Médecin partenaire",
      type: "MEDECIN" as const,
      quote: "Une équipe engagée qui transforme concrètement le quotidien des familles.",
      order: 4,
      published: true,
    },
    {
      name: "École Les Papillons",
      role: "Partenaire éducatif",
      type: "PARTENAIRE" as const,
      quote: "Un partenariat sincère qui ouvre de nouvelles perspectives à nos élèves.",
      order: 5,
      published: true,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }

  const partners = [
    {
      name: "Fondation Espoir",
      logoUrl: "https://placehold.co/200x80/e2e8f0/64748b?text=Fondation",
      websiteUrl: "https://example.com",
      order: 0,
      published: true,
    },
    {
      name: "Banque Solidaire",
      logoUrl: "https://placehold.co/200x80/e2e8f0/64748b?text=Banque",
      order: 1,
      published: true,
    },
    {
      name: "Ville de Paris",
      logoUrl: "https://placehold.co/200x80/e2e8f0/64748b?text=Ville",
      order: 2,
      published: true,
    },
    {
      name: "Entreprise Verte",
      logoUrl: "https://placehold.co/200x80/e2e8f0/64748b?text=Entreprise",
      order: 3,
      published: true,
    },
  ];

  for (const p of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.partner.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.partner.create({ data: p });
    }
  }

  console.log("Seed completed successfully");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
