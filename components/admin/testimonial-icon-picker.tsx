"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemedPersonIcon } from "@/components/icons/themed-person-icon";
import {
  TESTIMONIAL_ICON_CATALOG,
  TESTIMONIAL_ICON_CATEGORIES,
} from "@/lib/testimonial-icons";
import { cn } from "@/lib/utils";

interface TestimonialIconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
}

export function TestimonialIconPicker({ value, onChange }: TestimonialIconPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Tous");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return TESTIMONIAL_ICON_CATALOG.filter((icon) => {
      const matchCategory = category === "Tous" || icon.category === category;
      const matchSearch =
        !query ||
        icon.label.toLowerCase().includes(query) ||
        icon.key.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="icon-search">Rechercher une icône</Label>
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="icon-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex. cœur, personne, école…"
              className="pl-9"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground sm:pb-2">
          {filtered.length} icône{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TESTIMONIAL_ICON_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === cat
                ? "border-colibri-teal bg-colibri-teal/10 text-colibri-teal"
                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D1D5DB]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-h-[320px] overflow-y-auto rounded-xl border bg-[#F8FAFC] p-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune icône trouvée.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {filtered.map((icon) => {
              const selected = value === icon.key;
              return (
                <button
                  key={icon.key}
                  type="button"
                  title={icon.label}
                  onClick={() => onChange(icon.key)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border bg-white p-2.5 transition-all",
                    "hover:border-colibri-teal/40 hover:shadow-sm",
                    selected
                      ? "border-colibri-teal ring-2 ring-colibri-teal/25"
                      : "border-[#E5E7EB]"
                  )}
                >
                  <ThemedPersonIcon icon={icon.Icon} label={icon.label} className="h-6 w-6" />
                  <span className="line-clamp-2 text-center text-[10px] leading-tight text-[#6B7280]">
                    {icon.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
