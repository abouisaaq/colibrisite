"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState("EDITOR");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: role as "ADMIN" | "EDITOR",
    };

    startTransition(async () => {
      try {
        await createUser(data);
        toast.success("Utilisateur créé");
        router.refresh();
        (e.target as HTMLFormElement).reset();
      } catch {
        toast.error("Erreur (droits admin requis)");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-xl border bg-white space-y-4 max-w-lg">
      <h3 className="font-semibold text-colibri-blue">Nouvel utilisateur</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label htmlFor="name">Nom</Label><Input id="name" name="name" required className="mt-1" /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required className="mt-1" /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label htmlFor="password">Mot de passe</Label><Input id="password" name="password" type="password" required className="mt-1" /></div>
        <div>
          <Label>Rôle</Label>
          <Select value={role} onValueChange={(v) => v && setRole(v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EDITOR">Éditeur</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="bg-colibri-teal hover:bg-colibri-teal/90">Créer</Button>
    </form>
  );
}
