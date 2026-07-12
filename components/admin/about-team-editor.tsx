"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, UserRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveAboutTeam, uploadMedia } from "@/actions/admin";
import {
  ABOUT_TEAM_INTRO,
  MAX_ABOUT_TEAM_MEMBERS,
  type AboutTeamMember,
} from "@/lib/about-content";
import { toast } from "sonner";

interface AboutTeamEditorProps {
  intro?: string;
  members: AboutTeamMember[];
}

type EditableMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  photoUrl: string;
};

function toEditable(members: AboutTeamMember[]): EditableMember[] {
  return members.map((member, index) => ({
    id: `member-${index}-${member.name}`,
    name: member.name,
    role: member.role,
    description: member.description,
    photoUrl: member.photoUrl ?? "",
  }));
}

function MemberPhotoField({
  value,
  name,
  onChange,
}: {
  value: string;
  name: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
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
        const media = await uploadMedia(formData);
        onChange(media.url);
        toast.success("Photo téléversée");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
        {value ? (
          <Image src={value} alt={name || "Photo"} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#94A3B8]">
            <UserRound className="h-7 w-7" />
          </div>
        )}
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
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className="gap-1.5"
        >
          <Upload className="h-3.5 w-3.5" />
          {value ? "Changer" : "Photo"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="gap-1.5 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Retirer
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function AboutTeamEditor({ intro, members }: AboutTeamEditorProps) {
  const [teamIntro, setTeamIntro] = useState(intro?.trim() || ABOUT_TEAM_INTRO);
  const [items, setItems] = useState<EditableMember[]>(() => toEditable(members));
  const [isPending, startTransition] = useTransition();

  function updateMember(id: string, patch: Partial<EditableMember>) {
    setItems((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...patch } : member))
    );
  }

  function addMember() {
    if (items.length >= MAX_ABOUT_TEAM_MEMBERS) {
      toast.error(`Maximum ${MAX_ABOUT_TEAM_MEMBERS} membres`);
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: `member-new-${Date.now()}`,
        name: "",
        role: "",
        description: "",
        photoUrl: "",
      },
    ]);
  }

  function removeMember(id: string) {
    setItems((prev) => prev.filter((member) => member.id !== id));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveAboutTeam({
          intro: teamIntro,
          members: items.map(({ name, role, description, photoUrl }) => ({
            name,
            role,
            description,
            photoUrl: photoUrl || undefined,
          })),
        });
        toast.success("Équipe enregistrée");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur d'enregistrement");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="team-intro">Texte d&apos;introduction</Label>
        <Textarea
          id="team-intro"
          value={teamIntro}
          onChange={(e) => setTeamIntro(e.target.value)}
          rows={3}
          placeholder="Présentez votre équipe…"
        />
      </div>

      <div className="space-y-4">
        {items.map((member, index) => (
          <div
            key={member.id}
            className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#0F172A]">
                Membre {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={items.length <= 1}
                onClick={() => removeMember(member.id)}
                className="gap-1.5 text-red-600 hover:text-red-700 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
              <MemberPhotoField
                value={member.photoUrl}
                name={member.name}
                onChange={(photoUrl) => updateMember(member.id, { photoUrl })}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-1">
                  <Label>Nom</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    placeholder="Prénom Nom"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <Label>Rôle</Label>
                  <Input
                    value={member.role}
                    onChange={(e) => updateMember(member.id, { role: e.target.value })}
                    placeholder="Président, Bénévole…"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={member.description}
                    onChange={(e) =>
                      updateMember(member.id, { description: e.target.value })
                    }
                    rows={2}
                    placeholder="Courte présentation"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={items.length >= MAX_ABOUT_TEAM_MEMBERS || isPending}
          onClick={addMember}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="admin-btn-primary gap-2"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Enregistrement…" : "Enregistrer l'équipe"}
        </Button>
        <p className="w-full text-xs text-[#94A3B8] sm:w-auto sm:ml-auto">
          Jusqu&apos;à {MAX_ABOUT_TEAM_MEMBERS} membres affichés sur la page À propos
        </p>
      </div>
    </div>
  );
}
