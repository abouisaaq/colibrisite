"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { ActionIconPicker } from "@/components/admin/action-icon-picker";
import {
  DEFAULT_ACTION_ICON_KEY,
  normalizeActionIconKey,
} from "@/lib/action-icons";

interface ActionData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  imageUrl?: string | null;
}

interface ActionFormProps {
  actionData?: ActionData;
  action: (data: unknown) => Promise<unknown>;
  updateAction?: (id: string, data: unknown) => Promise<unknown>;
}

export function ActionForm({ actionData, action, updateAction }: ActionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [icon, setIcon] = useState(
    normalizeActionIconKey(actionData?.icon ?? DEFAULT_ACTION_ICON_KEY)
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
      description: formData.get("description") as string,
      icon,
      order: parseInt(formData.get("order") as string) || 0,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
    };

    startTransition(async () => {
      try {
        if (actionData?.id && updateAction) await updateAction(actionData.id, data);
        else await action(data);
        toast.success("Action enregistrée");
        router.push("/admin/actions");
        router.refresh();
      } catch {
        toast.error("Erreur");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" defaultValue={actionData?.title} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={actionData?.slug} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={actionData?.description}
          required
          rows={4}
          className="mt-1"
        />
      </div>

      <ActionIconPicker value={icon} onChange={setIcon} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={actionData?.order ?? 0}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">URL image</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            defaultValue={actionData?.imageUrl ?? ""}
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
