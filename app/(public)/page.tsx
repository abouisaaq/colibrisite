import { fetchHomePage } from "@/lib/convex-data";
import { parseSiteLogoHeight } from "@/lib/logo-size";
import { resolveMissionImages } from "@/lib/mission-images";
import { resolveSitePageImage } from "@/lib/site-images";
import { HeroSection } from "@/components/home/hero-section";
import { MissionSection } from "@/components/home/mission-section";
import { ActionsGrid } from "@/components/home/actions-grid";
import { StatBanner } from "@/components/home/stat-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsEventsSection } from "@/components/home/news-events-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { CtaSection } from "@/components/home/cta-section";
import { PartnersSection } from "@/components/home/partners-section";

export default async function HomePage() {
  const { settings, actions, articles, events, testimonials, partners } =
    await fetchHomePage();

  const heroImage = settings.hero_image || "/hero/hero-main.jpg";
  const missionImages = resolveMissionImages(settings);
  const donationImage = resolveSitePageImage(settings, "donation");

  return (
    <>
      <HeroSection
        title={settings.hero_title ?? "Porter l'espoir là où tout semble perdu"}
        subtitle={
          settings.hero_subtitle ??
          "Comme le colibri qui fait sa part, nous croyons que chaque geste compte. Rejoignez notre communauté et ensemble, changeons des vies."
        }
        imageUrl={heroImage}
        logoUrl={settings.site_logo}
        logoHeight={parseSiteLogoHeight(settings.site_logo_height)}
      />
      <StatBanner
        families={settings.stat_families ?? "2500"}
        volunteers={settings.stat_volunteers ?? "180"}
        projects={settings.stat_projects ?? "45"}
        partners={settings.stat_partners ?? "32"}
      />
      <MissionSection
        title={settings.mission_title ?? "Notre Mission"}
        text={
          settings.mission_text ??
          "Nous agissons pour soutenir les familles les plus vulnérables, renforcer les liens entre les communautés et redonner espoir grâce à des actions concrètes, humaines et durables."
        }
        images={missionImages}
        quote={
          settings.mission_quote ??
          "Chaque geste, aussi petit soit-il, peut changer une vie."
        }
      />
      <ActionsGrid
        actions={actions.map(
          (action: {
            id: string;
            title: string;
            slug: string;
            description: string;
            icon: string;
            order: number;
            imageUrl?: string;
          }) => ({
            id: action.id,
            title: action.title,
            slug: action.slug,
            description: action.description,
            icon: action.icon,
            order: action.order,
            imageUrl: action.imageUrl ?? null,
          })
        )}
        eyebrow={settings.actions_eyebrow}
        title={settings.actions_title}
        subtitle={settings.actions_subtitle}
      />
      <NewsEventsSection
        articles={articles.map(
          (article: {
            id: string;
            title: string;
            slug: string;
            excerpt: string;
            imageUrl?: string;
            category: string;
            publishedAt?: number;
            _creationTime: number;
          }) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            imageUrl: article.imageUrl ?? null,
            category: article.category,
            createdAt: new Date(article.publishedAt ?? article._creationTime),
          })
        )}
        events={events.map(
          (event: {
            id: string;
            title: string;
            slug: string;
            startDate: number;
            location: string;
            eventType: { name: string; color: string } | null;
          }) => ({
            id: event.id,
            title: event.title,
            slug: event.slug,
            startDate: new Date(event.startDate),
            location: event.location,
            eventType: event.eventType
              ? { name: event.eventType.name, color: event.eventType.color }
              : null,
          })
        )}
      />
      <TestimonialsSection
        testimonials={testimonials.map(
          (t: {
            id: string;
            name: string;
            role?: string;
            quote: string;
            type: string;
            iconKey?: string;
            usePhoto: boolean;
            imageUrl?: string;
            order: number;
          }) => ({
            id: t.id,
            name: t.name,
            role: t.role ?? null,
            quote: t.quote,
            type: t.type,
            iconKey: t.iconKey ?? null,
            usePhoto: t.usePhoto,
            imageUrl: t.imageUrl ?? null,
            order: t.order,
          })
        )}
        eyebrow={settings.testimonials_eyebrow}
        title={settings.testimonials_title}
        subtitle={settings.testimonials_subtitle}
      />
      <NewsletterSection
        title={settings.newsletter_title ?? "Recevez nos nouveautés sur WhatsApp"}
        subtitle={
          settings.newsletter_subtitle ??
          "Inscrivez votre numéro pour recevoir nos actualités, événements et l'impact de votre générosité directement sur WhatsApp."
        }
      />
      <CtaSection
        title={settings.cta_title}
        subtitle={settings.cta_subtitle}
        familiesCount={settings.stat_families ?? "500"}
        imageUrl={donationImage}
      />
      <PartnersSection
        title={settings.partners_title ?? "Ils nous font confiance"}
        subtitle={
          settings.partners_subtitle ??
          "Merci à nos partenaires et collaborateurs qui nous accompagnent au quotidien."
        }
        partners={partners.map(
          (p: {
            id: string;
            name: string;
            logoUrl: string;
            websiteUrl?: string;
            order: number;
          }) => ({
            id: p.id,
            name: p.name,
            logoUrl: p.logoUrl,
            websiteUrl: p.websiteUrl ?? null,
            order: p.order,
          })
        )}
      />
    </>
  );
}
