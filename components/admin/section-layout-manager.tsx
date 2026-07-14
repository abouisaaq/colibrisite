"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { savePageSectionsLayout } from "@/actions/admin";
import type { CmsPageId, CmsSectionDef, SectionLayoutItem } from "@/lib/page-sections";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SectionLayoutManager({
  page,
  defs,
  initialLayout,
}: {
  page: CmsPageId;
  defs: CmsSectionDef[];
  initialLayout: SectionLayoutItem[];
}) {
  const router = useRouter();
  const [layout, setLayout] = useState(() =>
    [...initialLayout].sort((a, b) => a.order - b.order)
  );
  const [isPending, startTransition] = useTransition();

  const defById = useMemo(
    () => new Map(defs.map((def) => [def.id, def])),
    [defs]
  );

  function move(id: string, direction: -1 | 1) {
    setLayout((prev) => {
      const movable = prev.filter((item) => {
        const def = defById.get(item.id);
        return def?.movable !== false;
      });
      const fixed = prev.filter((item) => defById.get(item.id)?.movable === false);

      const index = movable.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const target = index + direction;
      if (target < 0 || target >= movable.length) return prev;

      const nextMovable = [...movable];
      const current = nextMovable[index];
      const swap = nextMovable[target];
      if (!current || !swap) return prev;
      nextMovable[index] = swap;
      nextMovable[target] = current;

      const merged = [...fixed, ...nextMovable];
      return merged.map((item, order) => ({ ...item, order }));
    });
  }

  function toggleVisible(id: string) {
    const def = defById.get(id);
    if (def?.movable === false) return;
    setLayout((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  }

  function handleSave() {
    const payload = layout.map((item, order) => ({
      id: item.id,
      visible: item.visible,
      order,
    }));
    startTransition(async () => {
      try {
        await savePageSectionsLayout(page, payload);
        toast.success("Disposition enregistrée");
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'enregistrement");
      }
    });
  }

  const sorted = [...layout].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <p className="text-sm text-[#6B7280]">
        Changez l’ordre d’apparition des sections et leur visibilité sur le site.
        Les sections masquées ne s’affichent plus sur la page publique.
      </p>

      <ul className="space-y-2">
        {sorted.map((item, index) => {
          const def = defById.get(item.id);
          if (!def) return null;
          const movable = def.movable !== false;
          const canUp =
            movable &&
            sorted
              .slice(0, index)
              .some((row) => defById.get(row.id)?.movable !== false);
          const canDown =
            movable &&
            sorted
              .slice(index + 1)
              .some((row) => defById.get(row.id)?.movable !== false);

          return (
            <li
              key={item.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:flex-row sm:items-center sm:justify-between",
                !item.visible && "opacity-60"
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-1 text-[#CBD5E1]">
                  <GripVertical className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-[#111827]">{def.label}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{def.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5">
                  {item.visible ? (
                    <Eye className="h-3.5 w-3.5 text-[#0d8f5f]" aria-hidden />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden />
                  )}
                  <Switch
                    checked={item.visible}
                    disabled={!movable || isPending}
                    onCheckedChange={() => toggleVisible(item.id)}
                    aria-label={`Visibilité ${def.label}`}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canUp || isPending}
                  onClick={() => move(item.id, -1)}
                  aria-label={`Monter ${def.label}`}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canDown || isPending}
                  onClick={() => move(item.id, 1)}
                  aria-label={`Descendre ${def.label}`}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>

                <Button asChild type="button" variant="outline" size="sm" className="gap-1.5">
                  <Link href={def.href}>
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Link>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        disabled={isPending}
        onClick={handleSave}
        className="bg-colibri-teal hover:bg-colibri-teal/90"
      >
        {isPending ? "Enregistrement…" : "Enregistrer la disposition"}
      </Button>
    </div>
  );
}
