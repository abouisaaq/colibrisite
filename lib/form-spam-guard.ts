import {
  VOLUNTEER_AVAILABILITY_OPTIONS,
  VOLUNTEER_DOMAIN_OPTIONS,
} from "@/lib/volunteer-options";

/** Normalise l’email pour détecter les doublons (Gmail ignore les points). */
export function normalizeEmailForDedup(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at < 1) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const withoutDots = local.split("+")[0].replace(/\./g, "");
    return `${withoutDots}@${domain}`;
  }
  return trimmed;
}

function vowelRatio(text: string): number {
  const letters = text.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  if (letters.length === 0) return 1;
  const vowels = (
    letters.match(/[aeiouyAEIOUYàâäéèêëïîôùûüœæÀÂÄÉÈÊËÏÎÔÙÛÜŒÆ]/g) ?? []
  ).length;
  return vowels / letters.length;
}

/** Nom / prénom aléatoires (ex. Lcqi Sxateqmw). */
export function looksLikeGibberishName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 3) return false;
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) return true;

  const letters = trimmed.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  if (letters.length < 3) return false;

  const ratio = vowelRatio(letters);
  if (ratio < 0.18) return true;
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(letters)) {
    return true;
  }

  const upper = (letters.match(/[A-ZÀ-ÿ]/g) ?? []).length;
  const lower = (letters.match(/[a-zà-ÿ]/g) ?? []).length;
  if (
    upper > 0 &&
    lower > 0 &&
    letters.length <= 20 &&
    ratio < 0.4 &&
    upper >= 2
  ) {
    return true;
  }

  return false;
}

/** Emails avec points entre caractères (ex. u.t.o.t.epu.xe.g.13@gmail.com). */
export function isSuspiciousEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at < 1) return true;

  const local = trimmed.slice(0, at);
  const dots = (local.match(/\./g) ?? []).length;
  if (dots >= 4) return true;

  const segments = local.split(".");
  if (
    dots >= 3 &&
    segments.length >= 4 &&
    segments.every((part) => part.length <= 4)
  ) {
    return true;
  }

  return false;
}

/** Texte aléatoire sans espaces (compétences / message spam). */
export function looksLikeRandomBlob(text: string): boolean {
  const t = text.trim();
  if (t.length < 10) return false;
  if (/\s/.test(t) && t.split(/\s+/).length >= 2) return false;
  if (!/^[A-Za-z0-9]+$/.test(t)) return false;
  return t.length >= 12;
}

export type VolunteerSpamInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  skills?: string;
  message?: string;
  availabilityCount: number;
  domainsCount: number;
};

export function isVolunteerSpam(input: VolunteerSpamInput): boolean {
  const gibberishName =
    looksLikeGibberishName(input.firstName) ||
    looksLikeGibberishName(input.lastName);

  const suspiciousEmail = isSuspiciousEmail(input.email);

  const randomBlob =
    (input.skills && looksLikeRandomBlob(input.skills)) ||
    (input.message && looksLikeRandomBlob(input.message));

  const allAvailability =
    input.availabilityCount >= VOLUNTEER_AVAILABILITY_OPTIONS.length;
  const allDomains =
    input.domainsCount >= VOLUNTEER_DOMAIN_OPTIONS.length;
  const allBoxes = allAvailability && allDomains;

  if (suspiciousEmail && (gibberishName || randomBlob)) return true;
  if (gibberishName && randomBlob) return true;
  if (gibberishName && allBoxes) return true;
  if (suspiciousEmail && allBoxes) return true;

  return false;
}

export type ContactSpamInput = {
  name: string;
  email: string;
  message: string;
};

export function isContactSpam(input: ContactSpamInput): boolean {
  if (isSuspiciousEmail(input.email)) return true;
  if (looksLikeGibberishName(input.name)) return true;
  if (looksLikeRandomBlob(input.message)) return true;
  return false;
}

/** Honeypot rempli ou formulaire soumis trop vite. */
export function isBotSubmission(formData: FormData): boolean {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) return true;

  const startedRaw = formData.get("_formStarted");
  const started =
    typeof startedRaw === "string" ? Number(startedRaw) : Number(startedRaw);
  if (!Number.isFinite(started) || started <= 0) return true;

  const elapsed = Date.now() - started;
  if (elapsed < 3000) return true;
  if (elapsed > 24 * 60 * 60 * 1000) return true;

  return false;
}
