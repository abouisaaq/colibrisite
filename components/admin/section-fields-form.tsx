"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveSettings } from "@/actions/admin";
import { toast } from "sonner";

export type SectionFieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea";
  hint?: string;
  placeholder?: string;
  rows?: number;
};

export function SectionFieldsForm({
  fields,
  values,
  submitLabel = "Enregistrer",
}: {
  fields: SectionFieldDef[];
  values: Record<string, string>;
  submitLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    for (const field of fields) {
      payload[field.key] = String(formData.get(field.key) ?? "").trim();
    }

    startTransition(async () => {
      try {
        await saveSettings(payload);
        toast.success("Section enregistrée");
      } catch {
        toast.error("Erreur lors de l'enregistrement");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.key}
              name={field.key}
              rows={field.rows ?? 4}
              defaultValue={values[field.key] ?? ""}
              placeholder={field.placeholder}
              className="mt-1"
            />
          ) : (
            <Input
              id={field.key}
              name={field.key}
              defaultValue={values[field.key] ?? ""}
              placeholder={field.placeholder}
              className="mt-1"
            />
          )}
          {field.hint ? (
            <p className="mt-1 text-xs text-[#94A3B8]">{field.hint}</p>
          ) : null}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isPending}
        className="bg-colibri-teal hover:bg-colibri-teal/90"
      >
        {isPending ? "Enregistrement…" : submitLabel}
      </Button>
    </form>
  );
}
