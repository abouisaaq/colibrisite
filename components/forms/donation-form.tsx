"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PayPalDonationButtons } from "@/components/forms/paypal-donation-buttons";
import type { PayPalEnvironment } from "@/lib/paypal-types";
import { cn, formatCurrency } from "@/lib/utils";
import { DEFAULT_SITE_PAGE_IMAGES } from "@/lib/site-images";

const PRESET_AMOUNTS = [20, 50, 100];
const EASE = [0.22, 1, 0.36, 1] as const;

interface DonationFormProps {
  familiesCount?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  paypalClientId: string;
  paypalEnvironment: PayPalEnvironment;
}

function AmountPill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-xl border text-sm font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-colors duration-300",
        active
          ? "border-[#4FD1A5] bg-[#4FD1A5]/10 text-[#0d8f5f]"
          : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#4FD1A5]/45 hover:bg-[#4FD1A5]/8 hover:text-[#0d8f5f]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DonationForm({
  familiesCount = "500",
  title,
  subtitle,
  imageUrl,
  paypalClientId,
  paypalEnvironment,
}: DonationFormProps) {
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | "autre">(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const ctaTitle = title ?? "Votre don, leur espoir";
  const ctaSubtitle =
    subtitle ??
    "En faisant un don, vous nous aidez à poursuivre nos actions et à changer des vies.";
  const formattedFamilies = Number(familiesCount).toLocaleString("fr-FR");

  useEffect(() => {
    const param = searchParams.get("montant");
    if (!param) return;

    const parsed = parseFloat(param);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    if (PRESET_AMOUNTS.includes(parsed)) {
      setSelectedAmount(parsed);
      setCustomAmount("");
      return;
    }

    setSelectedAmount("autre");
    setCustomAmount(String(parsed));
  }, [searchParams]);

  const finalAmount =
    selectedAmount === "autre" ? parseFloat(customAmount) || 0 : selectedAmount;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <motion.div
          className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 lg:pr-6"
          initial={{ opacity: 0, x: -56 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
            Faire un don
          </p>
          <h2 className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#111827] sm:text-[2rem]">
            {ctaTitle}
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6B7280]">
            {ctaSubtitle}
          </p>

          <div className="mt-6">
            <p className="text-[13px] font-semibold text-[#374151]">Fréquence</p>
            <div className="mt-2 grid max-w-md grid-cols-2 gap-2.5">
              <div className="flex h-11 items-center justify-center rounded-xl border border-[#4FD1A5] bg-[#4FD1A5]/10 text-sm font-semibold text-[#0d8f5f]">
                Ponctuel
              </div>
              <div
                title="Les dons mensuels arriveront bientôt"
                className="flex h-11 cursor-not-allowed items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-sm font-semibold text-[#9CA3AF]"
              >
                Mensuel · bientôt
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[13px] font-semibold text-[#374151]">Montant</p>
            <div className="mt-2 grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PRESET_AMOUNTS.map((amount) => (
                <AmountPill
                  key={amount}
                  active={selectedAmount === amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                >
                  {amount} €
                </AmountPill>
              ))}
              <AmountPill
                active={selectedAmount === "autre"}
                onClick={() => setSelectedAmount("autre")}
              >
                Autre
              </AmountPill>
            </div>
          </div>

          {selectedAmount === "autre" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-3 max-w-md"
            >
              <label htmlFor="custom-donation-amount" className="sr-only">
                Montant libre en euros
              </label>
              <div className="relative">
                <input
                  id="custom-donation-amount"
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="Entrez votre montant"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#4FD1A5] bg-white px-4 pr-10 text-base font-medium text-[#111827] shadow-[0_2px_8px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#3CCB8A] focus:ring-2 focus:ring-[#4FD1A5]/25 sm:text-sm"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9CA3AF]">
                  €
                </span>
              </div>
            </motion.div>
          )}

          <div className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="donorName" className="text-[13px] font-semibold text-[#374151]">
                Nom <span className="font-normal text-[#9CA3AF]">(optionnel)</span>
              </label>
              <input
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-base text-[#111827] shadow-[0_2px_8px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#4FD1A5]/60 focus:ring-2 focus:ring-[#4FD1A5]/20 sm:text-sm"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="donorEmail" className="text-[13px] font-semibold text-[#374151]">
                Email <span className="font-normal text-[#9CA3AF]">(optionnel)</span>
              </label>
              <input
                id="donorEmail"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-base text-[#111827] shadow-[0_2px_8px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#4FD1A5]/60 focus:ring-2 focus:ring-[#4FD1A5]/20 sm:text-sm"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="mt-6 max-w-md rounded-xl bg-[#F8FAFC] px-4 py-3">
            <p className="text-[13px] text-[#6B7280]">Votre don</p>
            <p className="text-2xl font-bold text-[#111827]">
              {formatCurrency(finalAmount)}
            </p>
          </div>

          <motion.div
            className="relative mt-6 max-w-md overflow-x-clip"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          >
            <div
              className="pointer-events-none absolute -inset-3 rounded-2xl bg-[#4FD1A5]/[0.14] blur-2xl"
              aria-hidden
            />
            {paypalClientId ? (
              <PayPalScriptProvider
                options={{
                  clientId: paypalClientId,
                  currency: "EUR",
                  intent: "capture",
                  environment: paypalEnvironment,
                }}
              >
                <div className="relative z-[1] min-w-0 max-w-full [&_iframe]:max-w-full">
                  <PayPalDonationButtons
                    finalAmount={finalAmount}
                    donorName={donorName}
                    donorEmail={donorEmail}
                  />
                </div>
              </PayPalScriptProvider>
            ) : null}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[13px] leading-snug text-[#6B7280]">
              <Heart className="h-3.5 w-3.5 fill-[#F87171] text-[#F87171]" strokeWidth={0} />
              Plus de {formattedFamilies} familles accompagnées grâce à votre générosité.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative min-h-[280px] bg-white sm:min-h-[340px] lg:min-h-full"
          initial={{ opacity: 0, x: 56 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.06 }}
        >
          <Image
            src={imageUrl || DEFAULT_SITE_PAGE_IMAGES.donation}
            alt="Enfant tenant un cœur rouge, symbole d'espoir"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="donation-hero-image object-cover object-center"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
