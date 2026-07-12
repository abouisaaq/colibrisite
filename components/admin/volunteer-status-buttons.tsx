"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateVolunteerStatus } from "@/actions/admin";
import { toast } from "sonner";

export function VolunteerStatusButtons({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function update(newStatus: "NEW" | "REVIEWING" | "ACCEPTED" | "REJECTED") {
    startTransition(async () => {
      try {
        await updateVolunteerStatus(id, newStatus);
        toast.success("Statut mis à jour");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  if (status === "ACCEPTED" || status === "REJECTED") return null;

  return (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => update("ACCEPTED")}>
        Accepter
      </Button>
      <Button size="sm" variant="ghost" disabled={isPending} onClick={() => update("REJECTED")}>
        Refuser
      </Button>
    </div>
  );
}
