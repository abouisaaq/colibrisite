"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EventTypeData {
  id?: string;
  name: string;
  color: string;
  order: number;
}

interface EventTypeFormProps {
  eventType?: EventTypeData;
  action: (data: unknown) => Promise<unknown>;
  updateAction?: (id: string, data: unknown) => Promise<unknown>;
}

export function EventTypeForm({ eventType, action, updateAction }: EventTypeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      color: formData.get("color") as string,
      order: parseInt(formData.get("order") as string) || 0,
    };

    startTransition(async () => {
      try {
        if (eventType?.id && updateAction) await updateAction(eventType.id, data);
        else await action(data);
        toast.success("Type enregistré");
        router.push("/admin/types-evenements");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <Label htmlFor="name">Nom du type</Label>
        <Input
          id="name"
          name="name"
          defaultValue={eventType?.name}
          required
          placeholder="Ex. Distribution, Atelier, Collecte…"
          className="mt-1"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="color">Couleur</Label>
          <div className="mt-1 flex items-center gap-3">
            <Input
              id="color"
              name="color"
              type="color"
              defaultValue={eventType?.color ?? "#42D7C8"}
              className="h-11 w-16 cursor-pointer p-1"
            />
            <span className="text-sm text-muted-foreground">Couleur du badge et de la date</span>
          </div>
        </div>
        <div>
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={eventType?.order ?? 0}
            className="mt-1"
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="bg-colibri-teal hover:bg-colibri-teal/90">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
