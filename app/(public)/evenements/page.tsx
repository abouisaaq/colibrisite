import type { Metadata } from "next";
import { fetchEvents } from "@/lib/convex-data";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { EventsListing } from "@/components/events/events-listing";

export const metadata: Metadata = {
  title: "Événements",
  description: "Découvrez les prochains événements de Les Colibris Porteurs d'Espoir.",
};

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <>
      <PageHero
        eyebrow="AGENDA"
        title="Événements"
        description="Rejoignez-nous lors de nos prochains rendez-vous solidaires et conviviaux."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Événements" },
        ]}
      />

      <SiteMain>
        <section className="site-section bg-white">
          <div className="site-container">
            <EventsListing
              events={events.map(
                (event: {
                  id: string;
                  title: string;
                  slug: string;
                  description: string;
                  location: string;
                  startDate: number;
                  endDate?: number;
                  status: string;
                  eventType: { name: string; color: string } | null;
                }) => ({
                  id: event.id,
                  title: event.title,
                  slug: event.slug,
                  description: event.description,
                  location: event.location,
                  startDate: new Date(event.startDate).toISOString(),
                  endDate: event.endDate
                    ? new Date(event.endDate).toISOString()
                    : null,
                  status: event.status,
                  eventType: event.eventType
                    ? { name: event.eventType.name, color: event.eventType.color }
                    : null,
                })
              )}
            />
          </div>
        </section>
      </SiteMain>
    </>
  );
}
