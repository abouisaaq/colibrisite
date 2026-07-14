"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveSettings } from "@/actions/admin";
import { toast } from "sonner";
import { SETTING_KEYS } from "@/lib/setting-keys";
import {
  ABOUT_COMMITMENTS,
  ABOUT_COLIBRI_FABLE,
  ABOUT_STORY_DEFAULT,
  ABOUT_STORY_QUOTE,
  formatAboutValuesForEditor,
} from "@/lib/about-content";

type FieldType = "text" | "textarea" | "password" | "select";

type SettingsField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
};

type SettingsSection = {
  title: string;
  description?: string;
  fields: SettingsField[];
};

const sections: SettingsSection[] = [
  {
    title: "Pages Contact / Don / Bénévole",
    description: "Sous-titres des en-têtes de ces pages.",
    fields: [
      {
        key: SETTING_KEYS.contactHeroDescription,
        label: "Sous-titre — Contact",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.donationHeroDescription,
        label: "Sous-titre — Faire un don",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.volunteerHeroDescription,
        label: "Sous-titre — Devenir bénévole",
        type: "textarea",
      },
    ],
  },
  {
    title: "Contact & pied de page",
    fields: [
      { key: SETTING_KEYS.contactEmail, label: "Email", type: "text" },
      { key: SETTING_KEYS.contactPhoneFr, label: "Téléphone France", type: "text" },
      { key: SETTING_KEYS.contactPhoneMa, label: "Téléphone Maroc", type: "text" },
      { key: SETTING_KEYS.contactAddress, label: "Adresse", type: "text" },
      {
        key: SETTING_KEYS.footerTagline,
        label: "Texte du pied de page",
        type: "textarea",
        hint: "Court texte sous le logo dans le footer.",
      },
      { key: SETTING_KEYS.facebookUrl, label: "Lien Facebook", type: "text" },
      { key: SETTING_KEYS.instagramUrl, label: "Lien Instagram", type: "text" },
      { key: SETTING_KEYS.youtubeUrl, label: "Lien YouTube", type: "text" },
    ],
  },
  {
    title: "SEO",
    description: "Titre et description par défaut du site (moteurs de recherche).",
    fields: [
      { key: SETTING_KEYS.seoTitle, label: "Titre SEO", type: "text" },
      { key: SETTING_KEYS.seoDescription, label: "Description SEO", type: "textarea" },
    ],
  },
  {
    title: "PayPal",
    description:
      "Identifiants pour les dons en ligne. En local, le fichier .env reste utilisé en secours tant que Client ID et Secret ne sont pas remplis ici.",
    fields: [
      {
        key: SETTING_KEYS.paypalMode,
        label: "Mode",
        type: "select",
        options: [
          { value: "sandbox", label: "Sandbox (test)" },
          { value: "live", label: "Live (production)" },
        ],
      },
      {
        key: SETTING_KEYS.paypalClientId,
        label: "Client ID",
        type: "text",
        placeholder: "AXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        key: SETTING_KEYS.paypalClientSecret,
        label: "Secret",
        type: "password",
        placeholder: "Re-saisir pour modifier",
        hint: "Laissez vide pour conserver le secret actuel.",
      },
      {
        key: SETTING_KEYS.paypalWebhookId,
        label: "Webhook ID (optionnel)",
        type: "password",
        placeholder: "Re-saisir pour modifier",
        hint: "Laissez vide pour conserver le Webhook ID actuel.",
      },
    ],
  },
  {
    title: "RIB / virement bancaire",
    description:
      "Coordonnées affichées sur la page Faire un don via le bouton RIB.",
    fields: [
      {
        key: SETTING_KEYS.ribAccountHolder,
        label: "Bénéficiaire",
        type: "text",
        placeholder: "Les Colibris Porteurs d'Espoir",
      },
      {
        key: SETTING_KEYS.ribBankName,
        label: "Banque (optionnel)",
        type: "text",
        placeholder: "Nom de la banque",
      },
      {
        key: SETTING_KEYS.ribIban,
        label: "IBAN",
        type: "text",
        placeholder: "FR76 …",
      },
      {
        key: SETTING_KEYS.ribBic,
        label: "BIC / SWIFT",
        type: "text",
        placeholder: "XXXXXXXX",
      },
      {
        key: SETTING_KEYS.ribPdfUrl,
        label: "Lien PDF du RIB (optionnel)",
        type: "text",
        placeholder: "/uploads/rib.pdf",
        hint: "URL publique du fichier RIB à télécharger (ex. fichier dans Médias).",
      },
    ],
  },
];

const FIELD_DEFAULTS: Record<string, string> = {
  [SETTING_KEYS.aboutHeroDescription]:
    "Découvrez qui nous sommes et ce qui nous anime au quotidien.",
  [SETTING_KEYS.aboutStoryTitle]: "Des Colibris porteurs d'espoir",
  [SETTING_KEYS.aboutMission]: ABOUT_STORY_DEFAULT,
  [SETTING_KEYS.aboutStoryQuote]: ABOUT_STORY_QUOTE,
  [SETTING_KEYS.aboutValuesTitle]: "Ce qui nous guide chaque jour",
  [SETTING_KEYS.aboutValues]: formatAboutValuesForEditor(),
  [SETTING_KEYS.aboutColibriTitle]: "Faire sa part, ensemble",
  [SETTING_KEYS.aboutColibriText]: ABOUT_COLIBRI_FABLE,
  [SETTING_KEYS.aboutCommitmentsTitle]: "Notre promesse envers vous",
  [SETTING_KEYS.aboutCommitments]: ABOUT_COMMITMENTS.join("\n"),
  [SETTING_KEYS.aboutCtaTitle]: "Ensemble, faisons grandir l'espoir",
  [SETTING_KEYS.aboutCtaSubtitle]:
    "Chaque geste compte. Rejoignez notre communauté de donateurs et de bénévoles pour porter l'espoir aux familles qui en ont le plus besoin.",
  [SETTING_KEYS.ctaTitle]: "Votre don, leur espoir",
  [SETTING_KEYS.ctaSubtitle]:
    "En faisant un don, vous nous aidez à poursuivre nos actions et à changer des vies.",
  [SETTING_KEYS.contactHeroDescription]:
    "Une question ? N'hésitez pas à nous écrire, nous vous répondrons avec attention.",
  [SETTING_KEYS.donationHeroDescription]:
    "Votre générosité permet de porter l'espoir aux familles les plus vulnérables.",
  [SETTING_KEYS.volunteerHeroDescription]:
    "Rejoignez notre équipe de bénévoles passionnés et faites la différence sur le terrain.",
  [SETTING_KEYS.footerTagline]:
    "Association caritative dédiée à l'accompagnement des familles en difficulté.",
  [SETTING_KEYS.seoTitle]: "Les Colibris Porteurs d'Espoir",
  [SETTING_KEYS.seoDescription]:
    "Association caritative accompagnant les familles en difficulté. Découvrez nos actions et comment nous soutenir.",
  [SETTING_KEYS.actionsEyebrow]: "Nos engagements",
  [SETTING_KEYS.actionsTitle]: "Nos Actions",
  [SETTING_KEYS.actionsSubtitle]:
    "Des initiatives concrètes pour répondre aux besoins essentiels des familles que nous accompagnons.",
  [SETTING_KEYS.testimonialsEyebrow]: "Témoignages",
  [SETTING_KEYS.testimonialsTitle]: "Leurs mots, notre plus belle récompense",
  [SETTING_KEYS.testimonialsSubtitle]:
    "Découvrez les témoignages de bénéficiaires, bénévoles et partenaires qui font vivre notre mission.",
};

function fieldDefaultValue(key: string, settings: Record<string, string>): string {
  const saved = settings[key]?.trim();
  if (!saved) return FIELD_DEFAULTS[key] ?? "";

  if (key === SETTING_KEYS.aboutValues && !saved.includes("\n") && saved.includes(",")) {
    return FIELD_DEFAULTS[key] ?? saved;
  }

  return settings[key] ?? "";
}

export function SettingsForm({
  settings,
  hasPayPalSecret = false,
  hasPayPalWebhook = false,
}: {
  settings: Record<string, string>;
  hasPayPalSecret?: boolean;
  hasPayPalWebhook?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    for (const section of sections) {
      for (const field of section.fields) {
        if (field.type === "password") {
          const value = ((formData.get(field.key) as string) ?? "").trim();
          if (value) data[field.key] = value;
          continue;
        }

        data[field.key] = (formData.get(field.key) as string) ?? "";
      }
    }

    startTransition(async () => {
      try {
        await saveSettings(data);
        toast.success("Paramètres enregistrés");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border bg-[#F8FAFC] p-5 text-sm text-[#6B7280]">
        Contenu des pages Accueil et À propos :{" "}
        <a href="/admin/accueil" className="font-semibold text-colibri-teal hover:underline">
          Accueil
        </a>
        {" · "}
        <a href="/admin/a-propos" className="font-semibold text-colibri-teal hover:underline">
          À propos
        </a>
        . Ici : contact, SEO, PayPal et RIB.
      </div>
      {sections.map((section) => (
        <div key={section.title} className="space-y-4 rounded-xl border bg-white p-6">
          <div>
            <h3 className="font-semibold text-colibri-blue">{section.title}</h3>
            {section.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    name={field.key}
                    defaultValue={fieldDefaultValue(field.key, settings)}
                    rows={
                      field.key === SETTING_KEYS.aboutMission ||
                      field.key === SETTING_KEYS.aboutColibriText ||
                      field.key === SETTING_KEYS.aboutValues
                        ? 8
                        : 3
                    }
                    className="mt-1"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.key}
                    name={field.key}
                    defaultValue={settings[field.key] ?? field.options?.[0]?.value ?? ""}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <Input
                      id={field.key}
                      name={field.key}
                      type={field.type === "password" ? "password" : "text"}
                      defaultValue={
                        field.type === "password"
                          ? ""
                          : fieldDefaultValue(field.key, settings)
                      }
                      placeholder={field.placeholder}
                      className="mt-1"
                      autoComplete={field.type === "password" ? "new-password" : undefined}
                    />
                    {field.type === "password" &&
                    field.key === SETTING_KEYS.paypalClientSecret &&
                    hasPayPalSecret ? (
                      <p className="mt-1 text-xs text-[#0d8f5f]">Un secret est déjà enregistré.</p>
                    ) : null}
                    {field.type === "password" &&
                    field.key === SETTING_KEYS.paypalWebhookId &&
                    hasPayPalWebhook ? (
                      <p className="mt-1 text-xs text-[#0d8f5f]">
                        Un Webhook ID est déjà enregistré.
                      </p>
                    ) : null}
                  </>
                )}
                {field.hint ? (
                  <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="submit" disabled={isPending} className="bg-colibri-teal hover:bg-colibri-teal/90">
        {isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
      </Button>
    </form>
  );
}
