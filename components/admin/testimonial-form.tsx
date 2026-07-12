"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TestimonialIconPicker } from "@/components/admin/testimonial-icon-picker";
import { TestimonialPhotoUpload } from "@/components/admin/testimonial-photo-upload";
import { ThemedPersonIcon } from "@/components/icons/themed-person-icon";
import { toast } from "sonner";
import {
  TESTIMONIAL_TYPES,
  TESTIMONIAL_TYPE_CONFIG,
  resolveTestimonialType,
  getTestimonialVisual,
  type TestimonialTypeKey,
} from "@/lib/testimonial-types";
import { getDefaultIconKey } from "@/lib/testimonial-icons";
import { cn } from "@/lib/utils";

interface TestimonialData {
  id?: string;
  name: string;
  role?: string | null;
  quote: string;
  type?: string | null;
  iconKey?: string | null;
  usePhoto?: boolean;
  imageUrl?: string | null;
  order: number;
  published: boolean;
}

interface TestimonialFormProps {
  testimonial?: TestimonialData;
  action: (data: unknown) => Promise<unknown>;
  updateAction?: (id: string, data: unknown) => Promise<unknown>;
}

export function TestimonialForm({ testimonial, action, updateAction }: TestimonialFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultType = resolveTestimonialType(testimonial?.type, testimonial?.role ?? null);

  const [type, setType] = useState<TestimonialTypeKey>(defaultType);
  const [usePhoto, setUsePhoto] = useState(testimonial?.usePhoto ?? false);
  const [iconKey, setIconKey] = useState(
    testimonial?.iconKey ?? getDefaultIconKey(defaultType)
  );
  const [imageUrl, setImageUrl] = useState(testimonial?.imageUrl ?? "");
  const [name, setName] = useState(testimonial?.name ?? "");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const previewVisual = getTestimonialVisual(type, testimonial?.role ?? null, name || "A", iconKey);

  function handleTypeChange(nextType: TestimonialTypeKey) {
    setType(nextType);
    if (!testimonial?.iconKey) {
      setIconKey(getDefaultIconKey(nextType));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (usePhoto && !imageUrl.trim()) {
      toast.error("Ajoutez une photo ou revenez au mode icône");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      role: (formData.get("role") as string) || null,
      quote: formData.get("quote") as string,
      type,
      iconKey: iconKey || null,
      usePhoto: Boolean(usePhoto),
      imageUrl: imageUrl.trim() || null,
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "on",
    };

    startTransition(async () => {
      try {
        if (testimonial?.id && updateAction) await updateAction(testimonial.id, data);
        else await action(data);
        toast.success("Témoignage enregistré");
        router.push("/admin/temoignages");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur lors de l'enregistrement");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role">Rôle / fonction</Label>
          <Input
            id="role"
            name="role"
            defaultValue={testimonial?.role ?? ""}
            className="mt-1"
            placeholder="Bénéficiaire"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="type">Type de témoignage</Label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as TestimonialTypeKey)}
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TESTIMONIAL_TYPES.map((key) => (
            <option key={key} value={key}>
              {TESTIMONIAL_TYPE_CONFIG[key].label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Sert de catégorie et propose une icône par défaut si vous n&apos;en choisissez pas.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <Label className="text-base">Avatar affiché sur l&apos;accueil</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisissez une icône parmi {">"}80 options ou utilisez une photo.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setUsePhoto(false)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              !usePhoto
                ? "border-colibri-teal bg-colibri-teal/10 text-colibri-teal"
                : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
            )}
          >
            <Sparkles className="h-4 w-4" />
            Icône
          </button>
          <button
            type="button"
            onClick={() => setUsePhoto(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              usePhoto
                ? "border-colibri-teal bg-colibri-teal/10 text-colibri-teal"
                : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
            )}
          >
            <ImageIcon className="h-4 w-4" />
            Photo
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#4FD1A5]/25 via-[#60A5FA]/20 to-[#8B5CF6]/25 shadow-sm">
            {usePhoto && imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Aperçu" className="h-full w-full object-cover" />
            ) : (
              <ThemedPersonIcon
                icon={previewVisual.Icon}
                label={previewVisual.label}
                className="h-9 w-9"
              />
            )}
          </div>
          <div className="text-sm text-[#6B7280]">
            <p className="font-medium text-[#111827]">Aperçu en direct</p>
            <p className="mt-0.5">
              {usePhoto ? "Photo dans le cercle" : `Icône : ${previewVisual.iconKey}`}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {usePhoto ? (
            <TestimonialPhotoUpload
              value={imageUrl}
              onChange={setImageUrl}
              name={name}
              onUploadingChange={setIsUploadingPhoto}
            />
          ) : (
            <TestimonialIconPicker value={iconKey} onChange={setIconKey} />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="quote">Citation</Label>
        <Textarea
          id="quote"
          name="quote"
          defaultValue={testimonial?.quote}
          required
          rows={4}
          className="mt-1"
          placeholder="2 ou 3 lignes maximum pour un rendu optimal"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={testimonial?.order ?? 0}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={testimonial?.published ?? true}
        />
        <Label htmlFor="published">Publié sur la page d&apos;accueil</Label>
      </div>

      <Button
        type="submit"
        disabled={isPending || isUploadingPhoto}
        className="bg-colibri-teal hover:bg-colibri-teal/90"
      >
        {isPending ? "Enregistrement…" : isUploadingPhoto ? "Téléversement en cours…" : "Enregistrer"}
      </Button>
    </form>
  );
}
