"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadSiteLogo, removeSiteLogo, saveSiteLogoHeight } from "@/actions/admin";
import {
  DEFAULT_SITE_LOGO_HEIGHT,
  MAX_SITE_LOGO_HEIGHT,
  MIN_SITE_LOGO_HEIGHT,
} from "@/lib/logo-size";
import { toast } from "sonner";

interface LogoUploadProps {
  currentUrl?: string;
  currentHeight?: number;
}

export function LogoUpload({ currentUrl, currentHeight = DEFAULT_SITE_LOGO_HEIGHT }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [height, setHeight] = useState(currentHeight);
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
        const url = await uploadSiteLogo(formData);
        setPreview(url);
        toast.success("Logo enregistré");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur lors du téléversement";
        toast.error(message);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeSiteLogo();
        setPreview("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success("Logo supprimé");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  function handleHeightChange(value: number) {
    setHeight(value);
  }

  function handleHeightCommit() {
    startTransition(async () => {
      try {
        const saved = await saveSiteLogoHeight(height);
        setHeight(saved);
        toast.success("Taille du logo enregistrée");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur lors de l'enregistrement";
        toast.error(message);
      }
    });
  }

  const maxWidth = Math.round(height * 4.5);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-white">
          {preview ? (
            <Image
              src={preview}
              alt="Aperçu du logo"
              width={maxWidth}
              height={height}
              className="w-auto object-contain p-2"
              style={{ height, maxWidth, width: "auto" }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs font-medium">Votre logo</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h4 className="font-semibold text-[#111827]">Logo de l&apos;association</h4>
            <p className="mt-1 text-sm text-[#6B7280]">
              Téléversez votre logo et ajustez sa taille dans le header du site.
            </p>
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
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {preview ? "Changer le logo" : "Téléverser un logo"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={handleRemove}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="logo-height" className="text-sm font-medium text-[#111827]">
                Taille dans le header
              </label>
              <span className="text-sm font-semibold tabular-nums text-[#0d8f5f]">
                {height} px
              </span>
            </div>
            <input
              id="logo-height"
              type="range"
              min={MIN_SITE_LOGO_HEIGHT}
              max={MAX_SITE_LOGO_HEIGHT}
              step={1}
              value={height}
              disabled={isPending}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              onMouseUp={handleHeightCommit}
              onTouchEnd={handleHeightCommit}
              className="mt-3 h-2 w-full cursor-pointer accent-[#3CCB8A]"
            />
            <div className="mt-1 flex justify-between text-xs text-[#9CA3AF]">
              <span>Petit ({MIN_SITE_LOGO_HEIGHT}px)</span>
              <span>Grand ({MAX_SITE_LOGO_HEIGHT}px)</span>
            </div>
          </div>

          <p className="text-xs text-[#9CA3AF]">
            Format recommandé : PNG transparent. Le footer garde une taille fixe.
          </p>
        </div>
      </div>
    </div>
  );
}
