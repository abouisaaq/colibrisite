"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartnerLogoUpload } from "@/components/admin/partner-logo-upload";
import { toast } from "sonner";

interface PartnerData {
  id?: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  order: number;
  published: boolean;
}

interface PartnerFormProps {
  partner?: PartnerData;
  action: (data: unknown) => Promise<unknown>;
  updateAction?: (id: string, data: unknown) => Promise<unknown>;
}

export function PartnerForm({ partner, action, updateAction }: PartnerFormProps) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!logoUrl.trim()) {
      toast.error("Veuillez ajouter un logo");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      logoUrl: logoUrl.trim(),
      websiteUrl: (formData.get("websiteUrl") as string) || undefined,
      order: parseInt(formData.get("order") as string) || 0,
      published: formData.get("published") === "on",
    };

    startTransition(async () => {
      try {
        if (partner?.id && updateAction) await updateAction(partner.id, data);
        else await action(data);
        toast.success("Partenaire enregistré");
        router.push("/admin/partenaires");
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'enregistrement");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <PartnerLogoUpload value={logoUrl} onChange={setLogoUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom du partenaire</Label>
          <Input id="name" name="name" defaultValue={partner?.name} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="order">Ordre d&apos;affichage</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={partner?.order ?? 0}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="websiteUrl">Site web (optionnel)</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          defaultValue={partner?.websiteUrl ?? ""}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={partner?.published ?? true}
        />
        <Label htmlFor="published">Afficher sur la page d&apos;accueil</Label>
      </div>

      <Button type="submit" disabled={isPending} className="bg-colibri-teal hover:bg-colibri-teal/90">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
