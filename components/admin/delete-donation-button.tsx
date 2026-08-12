"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDonation } from "@/actions/admin";
import { toast } from "sonner";

export function DeleteDonationButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={isPending}
      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
      aria-label="Supprimer ce don"
      onClick={() => {
        const confirmed = window.confirm(
          "Supprimer cette entrée de don ? Cette action est irréversible."
        );
        if (!confirmed) return;
        startTransition(async () => {
          try {
            await deleteDonation(id);
            toast.success("Don supprimé");
          } catch {
            toast.error("Erreur lors de la suppression");
          }
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
