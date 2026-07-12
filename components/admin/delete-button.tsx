"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
}

export function DeleteButton({ id, action }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    startTransition(async () => {
      try {
        await action(id);
        toast.success("Supprimé avec succès");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
