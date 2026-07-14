"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type RibDetails = {
  accountHolder?: string;
  bankName?: string;
  iban?: string;
  bic?: string;
  pdfUrl?: string;
};

function formatIban(iban: string) {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

async function copyText(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copié`);
  } catch {
    toast.error("Impossible de copier");
  }
}

function RibRow({
  label,
  value,
  copyValue,
  mono = false,
}: {
  label: string;
  value: string;
  copyValue?: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group flex items-start justify-between gap-3 border-b border-[#E8EEF2] py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-[0.04em] text-[#94A3B8]">
          {label}
        </p>
        <p
          className={
            mono
              ? "mt-1 break-all font-mono text-[13px] font-semibold tracking-wide text-[#0F172A]"
              : "mt-1 text-[14px] font-semibold text-[#0F172A]"
          }
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await copyText(label, copyValue ?? value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        className="mt-0.5 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium text-[#64748B] transition-colors hover:bg-[#ECFDF8] hover:text-[#0d8f5f]"
        aria-label={`Copier ${label}`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Copié
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            Copier
          </>
        )}
      </button>
    </div>
  );
}

export function RibDonationButton({ rib }: { rib: RibDetails }) {
  const accountHolder =
    rib.accountHolder?.trim() || "Les Colibris Porteurs d'Espoir";
  const bankName = rib.bankName?.trim() ?? "";
  const iban = (rib.iban?.trim() ?? "").replace(/\s+/g, "").toUpperCase();
  const bic = (rib.bic?.trim() ?? "").replace(/\s+/g, "").toUpperCase();
  const pdfUrl = rib.pdfUrl?.trim() ?? "";

  return (
    <Dialog>
      <div className="relative z-[1] mt-1">
        <div className="my-3 flex items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
            ou
          </span>
          <span className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <DialogTrigger className="group flex h-[45px] w-full items-center justify-center gap-2.5 rounded-[4px] bg-[#0B3D2E] text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#0F4A38] active:bg-[#092F24]">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white/12 text-[10px] font-bold tracking-tight">
            RIB
          </span>
          Virement bancaire
        </DialogTrigger>
      </div>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[420px] [&_[data-slot=dialog-close]]:text-white/80 [&_[data-slot=dialog-close]]:hover:bg-white/10 [&_[data-slot=dialog-close]]:hover:text-white">
        <div className="bg-gradient-to-br from-[#0B3D2E] via-[#0F4A38] to-[#146B52] px-5 pb-5 pt-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
            Relevé d&apos;identité bancaire
          </p>
          <DialogHeader className="mt-2 gap-1">
            <DialogTitle className="font-heading text-[1.25rem] font-bold text-white">
              {accountHolder}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-white/70">
              Virement SEPA — précisez votre nom dans le libellé si possible.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-5 py-2">
          {bankName ? <RibRow label="Banque" value={bankName} /> : null}
          {iban ? (
            <RibRow
              label="IBAN"
              value={formatIban(iban)}
              copyValue={iban}
              mono
            />
          ) : null}
          {bic ? (
            <RibRow label="BIC" value={bic} copyValue={bic} mono />
          ) : null}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#ECFDF8] text-sm font-semibold text-[#0d8f5f] transition-colors hover:bg-[#D1FAE5]"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Télécharger le RIB
            </a>
          ) : (
            <div className="h-3" aria-hidden />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
