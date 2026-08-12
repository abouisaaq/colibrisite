"use client";

import { ExternalLink } from "lucide-react";

function buildPaypalMeHref(baseUrl: string, amount: number): string {
  const trimmed = baseUrl.trim();
  if (!trimmed) return "";

  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return trimmed;
  }

  // Si le lien contient déjà un montant (/50 ou /50EUR), on le remplace.
  const pathParts = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const last = pathParts[pathParts.length - 1] ?? "";
  if (/^\d+(\.\d+)?([A-Za-z]{3})?$/.test(last)) {
    pathParts.pop();
  }

  if (amount >= 1) {
    pathParts.push(String(Math.round(amount)));
  }

  url.pathname = `/${pathParts.join("/")}`;
  return url.toString();
}

export function PayPalMeButton({
  url,
  amount,
}: {
  url: string;
  amount: number;
}) {
  const href = buildPaypalMeHref(url, amount);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-[1] mt-2 flex h-[45px] w-full items-center justify-center gap-2 rounded-[4px] border border-[#0070BA]/35 bg-[#0070BA] text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#005EA6] active:bg-[#004C8C]"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white/15 text-[10px] font-bold">
        €
      </span>
      Donner via PayPal.me
      <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
    </a>
  );
}
