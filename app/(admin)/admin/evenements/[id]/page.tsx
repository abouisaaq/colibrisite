import { notFound } from "next/navigation";
import { fetchEventById, fetchEventTypes } from "@/lib/convex-data";
import { EventForm } from "@/components/admin/event-form";
import { createEvent, updateEvent } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const [event, eventTypes] = await Promise.all([
    fetchEventById(id),
    fetchEventTypes(),
  ]);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier l'événement"
        description="Mettez à jour les informations de l'événement"
      />
      <AdminPanel padded>
        <EventForm
          event={{
            id: event.id,
            title: event.title,
            slug: event.slug,
            description: event.description,
            location: event.location,
            startDate: new Date(event.startDate).toISOString(),
            endDate: event.endDate
              ? new Date(event.endDate).toISOString()
              : null,
            imageUrl: event.imageUrl ?? null,
            eventTypeId: event.eventTypeId ?? null,
            status: event.status,
          }}
          eventTypes={eventTypes.map((t) => ({
            id: t.id,
            name: t.name,
            color: t.color,
          }))}
          action={createEvent}
          updateAction={updateEvent}
        />
      </AdminPanel>
    </div>
  );
}
