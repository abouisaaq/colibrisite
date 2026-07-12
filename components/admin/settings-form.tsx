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
    title: "Page d'accueil",
    description:
      "Textes du hero, mission, don, WhatsApp, partenaires, Nos Actions et Témoignages. Images : Médias. Cartes actions / témoignages : menus Contenu.",
    fields: [
      { key: SETTING_KEYS.heroTitle, label: "Titre hero", type: "text" },
      { key: SETTING_KEYS.heroSubtitle, label: "Sous-titre hero", type: "textarea" },
      { key: SETTING_KEYS.missionTitle, label: "Titre mission", type: "text" },
      { key: SETTING_KEYS.missionText, label: "Texte mission", type: "textarea" },
      { key: SETTING_KEYS.missionQuote, label: "Citation mission", type: "textarea" },
      {
        key: SETTING_KEYS.ctaTitle,
        label: "Titre bloc don",
        type: "text",
        hint: "Aussi utilisé sur la page Faire un don.",
      },
      {
        key: SETTING_KEYS.ctaSubtitle,
        label: "Sous-titre bloc don",
        type: "textarea",
        hint: "Aussi utilisé sur la page Faire un don.",
      },
      { key: SETTING_KEYS.newsletterTitle, label: "Titre section WhatsApp", type: "text" },
      {
        key: SETTING_KEYS.newsletterSubtitle,
        label: "Sous-titre section WhatsApp",
        type: "textarea",
      },
      { key: SETTING_KEYS.partnersTitle, label: "Titre section partenaires", type: "text" },
      {
        key: SETTING_KEYS.partnersSubtitle,
        label: "Sous-titre section partenaires",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.actionsEyebrow,
        label: "Sur-titre — Nos Actions",
        type: "text",
        hint: "Les cartes d’actions se gèrent dans Contenu → Actions.",
      },
      { key: SETTING_KEYS.actionsTitle, label: "Titre — Nos Actions", type: "text" },
      {
        key: SETTING_KEYS.actionsSubtitle,
        label: "Sous-titre — Nos Actions",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.testimonialsEyebrow,
        label: "Sur-titre — Témoignages",
        type: "text",
        hint: "Les témoignages se gèrent dans Contenu → Témoignages.",
      },
      { key: SETTING_KEYS.testimonialsTitle, label: "Titre — Témoignages", type: "text" },
      {
        key: SETTING_KEYS.testimonialsSubtitle,
        label: "Sous-titre — Témoignages",
        type: "textarea",
      },
    ],
  },
  {
    title: "Statistiques d'impact",
    description: "Chiffres affichés sur l’accueil, À propos, dons et bénévolat.",
    fields: [
      { key: SETTING_KEYS.statFamilies, label: "Familles aidées", type: "text" },
      { key: SETTING_KEYS.statVolunteers, label: "Bénévoles actifs", type: "text" },
      { key: SETTING_KEYS.statProjects, label: "Projets réalisés", type: "text" },
      { key: SETTING_KEYS.statPartners, label: "Partenaires", type: "text" },
    ],
  },
  {
    title: "À propos",
    description:
      "Textes de la page À propos. Images et membres de l’équipe : Médias.",
    fields: [
      {
        key: SETTING_KEYS.aboutHeroDescription,
        label: "Sous-titre de l’en-tête",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.aboutStoryTitle,
        label: "Titre — Notre histoire",
        type: "text",
        placeholder: "Des Colibris porteurs d'espoir",
      },
      {
        key: SETTING_KEYS.aboutMission,
        label: "Texte — Notre histoire",
        type: "textarea",
        hint: "Séparez les paragraphes par une ligne vide.",
      },
      {
        key: SETTING_KEYS.aboutStoryQuote,
        label: "Citation — Notre histoire",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.aboutValuesTitle,
        label: "Titre — Nos valeurs",
        type: "text",
      },
      {
        key: SETTING_KEYS.aboutValues,
        label: "Cartes des valeurs",
        type: "textarea",
        hint: "Jusqu’à 4 valeurs. Format : titre, puis description, blocs séparés par une ligne vide.",
      },
      {
        key: SETTING_KEYS.aboutColibriTitle,
        label: "Titre — Pourquoi le Colibri",
        type: "text",
      },
      {
        key: SETTING_KEYS.aboutColibriText,
        label: "Texte — Pourquoi le Colibri",
        type: "textarea",
      },
      {
        key: SETTING_KEYS.aboutCommitmentsTitle,
        label: "Titre — Nos engagements",
        type: "text",
      },
      {
        key: SETTING_KEYS.aboutCommitments,
        label: "Liste des engagements",
        type: "textarea",
        hint: "Un engagement par ligne.",
      },
      {
        key: SETTING_KEYS.aboutCtaTitle,
        label: "Titre — Appel à l’action final",
        type: "text",
      },
      {
        key: SETTING_KEYS.aboutCtaSubtitle,
        label: "Texte — Appel à l’action final",
        type: "textarea",
      },
    ],
  },
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
        Logo, photos du site et membres de l’équipe :{" "}
        <a href="/admin/medias" className="font-semibold text-colibri-teal hover:underline">
          Médias
        </a>
        . Intro équipe aussi dans Médias → Notre équipe.
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
