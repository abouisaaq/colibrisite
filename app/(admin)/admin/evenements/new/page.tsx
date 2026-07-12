import { fetchEventTypes } from "@/lib/convex-data";
import { EventForm } from "@/components/admin/event-form";
import { createEvent } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function NewEventPage() {
  const eventTypes = await fetchEventTypes();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouvel événement"
        description="Planifiez un événement pour l'association"
      />
      <AdminPanel padded>
        <EventForm
          eventTypes={eventTypes.map((t) => ({
            id: t.id,
            name: t.name,
            color: t.color,
          }))}
          action={createEvent}
        />
      </AdminPanel>
    </div>
  );
}
