"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createManualDonation } from "@/actions/admin";
import { toast } from "sonner";

export function ManualDonationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const donorName = String(formData.get("donorName") ?? "").trim();
    const donorEmail = String(formData.get("donorEmail") ?? "").trim();

    startTransition(async () => {
      try {
        await createManualDonation({
          amount,
          donorName: donorName || undefined,
          donorEmail: donorEmail || undefined,
        });
        toast.success("Don enregistré");
        formRef.current?.reset();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'enregistrement"
        );
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#E8EDF3] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.03)]"
    >
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          Enregistrer un don PayPal.me
        </h2>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Les paiements PayPal.me ne remontent pas automatiquement. Ajoutez ici
          les dons reçus pour le tableau de bord et le suivi.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="donation-amount">Montant (€)</Label>
          <Input
            id="donation-amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            placeholder="10"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="donation-name">Nom (optionnel)</Label>
          <Input
            id="donation-name"
            name="donorName"
            placeholder="Donateur"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="donation-email">Email (optionnel)</Label>
          <Input
            id="donation-email"
            name="donorEmail"
            type="email"
            placeholder="email@exemple.com"
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-colibri-teal hover:bg-colibri-teal/90"
          >
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
