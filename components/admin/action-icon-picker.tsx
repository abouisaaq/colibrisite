"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACTION_ICON_CATALOG,
  ACTION_ICON_CATEGORIES,
  getActionIconEntry,
} from "@/lib/action-icons";
import { cn } from "@/lib/utils";

interface ActionIconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
}

export function ActionIconPicker({ value, onChange }: ActionIconPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Tous");
  const selected = getActionIconEntry(value);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ACTION_ICON_CATALOG.filter((icon) => {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <Label htmlFor="action-icon-search">Icône</Label>
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="action-icon-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex. eau, école, cœur, colis…"
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#475569]">
          <selected.Icon className="h-5 w-5 text-colibri-teal" strokeWidth={1.75} />
          <span className="font-medium text-[#111827]">{selected.label}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ACTION_ICON_CATEGORIES.map((cat) => (
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

      <div className="max-h-[360px] overflow-y-auto rounded-xl border bg-[#F8FAFC] p-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune icône trouvée.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {filtered.map((icon) => {
              const isSelected = value === icon.key;
              return (
                <button
                  key={icon.key}
                  type="button"
                  title={icon.label}
                  onClick={() => onChange(icon.key)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border bg-white p-2.5 transition-all",
                    "hover:border-colibri-teal/40 hover:shadow-sm",
                    isSelected
                      ? "border-colibri-teal ring-2 ring-colibri-teal/25"
                      : "border-[#E5E7EB]"
                  )}
                >
                  <icon.Icon
                    className="h-6 w-6 text-[#0f766e]"
                    strokeWidth={1.7}
                    aria-hidden
                  />
                  <span className="line-clamp-2 text-center text-[10px] leading-tight text-[#6B7280]">
                    {icon.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-[#94A3B8]">
        {filtered.length} icône{filtered.length > 1 ? "s" : ""} — cliquez pour sélectionner.
      </p>
    </div>
  );
}
