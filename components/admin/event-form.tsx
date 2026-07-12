"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface EventTypeOption {
  id: string;
  name: string;
  color: string;
}

interface EventData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  imageUrl?: string | null;
  eventTypeId?: string | null;
  status: string;
}

interface EventFormProps {
  event?: EventData;
  eventTypes: EventTypeOption[];
  action: (data: unknown) => Promise<unknown>;
  updateAction?: (id: string, data: unknown) => Promise<unknown>;
}

export function EventForm({ event, eventTypes, action, updateAction }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      eventTypeId: formData.get("eventTypeId") as string,
      status: formData.get("status") as string,
    };

    startTransition(async () => {
      try {
        if (event?.id && updateAction) await updateAction(event.id, data);
        else await action(data);
        toast.success("Événement enregistré");
        router.push("/admin/evenements");
        router.refresh();
      } catch {
        toast.error("Erreur");
      }
    });
  }

  const startDate = event?.startDate
    ? new Date(event.startDate).toISOString().slice(0, 16)
    : "";
  const endDate = event?.endDate
    ? new Date(event.endDate).toISOString().slice(0, 16)
    : "";

  if (eventTypes.length === 0) {
    return (
      <div className="max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-medium">Aucun type d&apos;événement créé.</p>
        <p className="mt-2">
          Créez d&apos;abord au moins un type dans{" "}
          <Link href="/admin/types-evenements/new" className="font-semibold underline">
            Types d&apos;événements
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="title">Titre</Label><Input id="title" name="title" defaultValue={event?.title} required className="mt-1" /></div>
        <div><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={event?.slug} className="mt-1" /></div>
      </div>
      <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={event?.description} required rows={4} className="mt-1" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="location">Lieu</Label><Input id="location" name="location" defaultValue={event?.location} required className="mt-1" /></div>
        <div><Label htmlFor="imageUrl">URL image</Label><Input id="imageUrl" name="imageUrl" defaultValue={event?.imageUrl ?? ""} className="mt-1" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="startDate">Date début</Label><Input id="startDate" name="startDate" type="datetime-local" defaultValue={startDate} required className="mt-1" /></div>
        <div><Label htmlFor="endDate">Date fin</Label><Input id="endDate" name="endDate" type="datetime-local" defaultValue={endDate} className="mt-1" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="eventTypeId">Type d&apos;événement</Label>
          <select
            id="eventTypeId"
            name="eventTypeId"
            defaultValue={event?.eventTypeId ?? eventTypes[0]?.id ?? ""}
            required
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            <Link href="/admin/types-evenements" className="text-[#42D7C8] hover:underline">
              Gérer les types
            </Link>
          </p>
        </div>
        <div>
          <Label htmlFor="status">Statut</Label>
          <select
            id="status"
            name="status"
            defaultValue={event?.status ?? "UPCOMING"}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="UPCOMING">À venir</option>
            <option value="ONGOING">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="bg-colibri-teal hover:bg-colibri-teal/90">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
