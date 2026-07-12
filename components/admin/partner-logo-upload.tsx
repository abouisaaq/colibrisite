"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/actions/admin";
import { toast } from "sonner";

interface PartnerLogoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function PartnerLogoUpload({ value, onChange }: PartnerLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (PNG, JPG, SVG…)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const media = await uploadMedia(formData);
        onChange(media.url);
        toast.success("Logo téléversé");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur lors du téléversement");
      }
    });
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <Label>Logo du partenaire</Label>

      <div className="flex flex-col gap-4 rounded-xl border bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-[#E5E7EB] bg-white sm:h-20 sm:w-44">
          {value ? (
            <div className="relative h-14 w-full max-w-[160px] px-4">
              <Image src={value} alt="Aperçu du logo" fill className="object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Aucun logo</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isPending ? "Téléversement…" : value ? "Remplacer" : "Téléverser un logo"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" disabled={isPending} onClick={handleRemove}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="logoUrl" className="text-xs text-muted-foreground">
          Ou coller une URL
        </Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder="https://... ou /uploads/..."
          className="mt-1"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Format recommandé : PNG transparent, fond clair. Le logo s&apos;affiche en niveaux de gris
        sur l&apos;accueil et reprend ses couleurs au survol.
      </p>
    </div>
  );
}
