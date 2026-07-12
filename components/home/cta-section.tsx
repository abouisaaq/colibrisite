"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_SITE_PAGE_IMAGES } from "@/lib/site-images";

interface CtaSectionProps {
  title?: string;
  subtitle?: string;
  familiesCount?: string;
  imageUrl?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function CtaSection({
  title,
  subtitle,
  familiesCount = "500",
  imageUrl,
}: CtaSectionProps) {
  const amounts = [20, 50, 100];
  const [selectedAmount, setSelectedAmount] = useState<number | "autre">(50);
  const [customAmount, setCustomAmount] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  const ctaTitle = title ?? "Votre don, leur espoir";
  const ctaSubtitle =
    subtitle ??
    "En faisant un don, vous nous aidez à poursuivre nos actions et à changer des vies.";

  const formattedFamilies = Number(familiesCount).toLocaleString("fr-FR");

  const resolvedAmount =
    selectedAmount === "autre" ? parseFloat(customAmount) || 0 : selectedAmount;
  const donationHref =
    resolvedAmount > 0
      ? `/faire-un-don?montant=${resolvedAmount}`
      : "/faire-un-don";
  const canDonate = selectedAmount !== "autre" || resolvedAmount > 0;

  return (
    <section ref={sectionRef} className="site-section bg-[#F8FAFC]">
      <div className="site-container">
        <div className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <motion.div
              className="order-2 flex flex-col justify-center p-6 sm:p-8 lg:order-1 lg:p-10 lg:pr-6"
              initial={false}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, y: 20 }}
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

              <div className="mt-7 grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
                {amounts.map((amount, index) => (
                  <motion.button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    initial={false}
                    animate={
                      inView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 12 }
                    }
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: inView ? 0.15 + index * 0.08 : 0,
                    }}
                    className={cn(
                      "h-11 rounded-xl border text-sm font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-colors duration-300",
                      selectedAmount === amount
                        ? "border-[#4FD1A5] bg-[#4FD1A5]/10 text-[#0d8f5f]"
                        : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#4FD1A5]/45 hover:bg-[#4FD1A5]/8 hover:text-[#0d8f5f]"
                    )}
                  >
                    {amount} €
                  </motion.button>
                ))}
                <motion.button
                  type="button"
                  onClick={() => setSelectedAmount("autre")}
                  initial={false}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                  }
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: inView ? 0.15 + amounts.length * 0.08 : 0,
                  }}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-colors duration-300",
                    selectedAmount === "autre"
                      ? "border-[#4FD1A5] bg-[#4FD1A5]/10 text-[#0d8f5f]"
                      : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#4FD1A5]/45 hover:bg-[#4FD1A5]/8 hover:text-[#0d8f5f]"
                  )}
                >
                  Autre
                </motion.button>
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
                      autoFocus
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9CA3AF]">
                      €
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="relative mt-7 max-w-md"
                initial={false}
                animate={
                  inView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.96 }
                }
                transition={{ duration: 0.7, ease: EASE, delay: inView ? 0.45 : 0 }}
              >
                <div
                  className="pointer-events-none absolute -inset-3 rounded-2xl bg-[#4FD1A5]/[0.14] blur-2xl"
                  aria-hidden
                />
                <Link
                  href={donationHref}
                  aria-disabled={!canDonate}
                  className={cn(
                    "relative inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4FD1A5] via-[#5BB8F0] to-[#8B5CF6] px-6 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(79,209,165,0.32)] transition-transform duration-300 hover:scale-[1.02]",
                    !canDonate && "pointer-events-none opacity-50"
                  )}
                >
                  <Heart className="h-4 w-4 fill-white text-white" strokeWidth={0} />
                  Je fais un don
                </Link>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[13px] leading-snug text-[#6B7280]">
                  <Heart className="h-3.5 w-3.5 fill-[#F87171] text-[#F87171]" strokeWidth={0} />
                  Plus de {formattedFamilies} familles accompagnées grâce à votre
                  générosité.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-1 isolate min-h-[260px] overflow-hidden sm:min-h-[320px] lg:order-2 lg:min-h-full lg:h-full"
              initial={false}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: inView ? 0.06 : 0 }}
            >
              <Image
                src={imageUrl || DEFAULT_SITE_PAGE_IMAGES.donation}
                alt="Enfant tenant un cœur rouge, symbole d'espoir"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="!absolute !inset-0 h-full w-full object-cover object-top"
                priority
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[40%] bg-gradient-to-r from-white from-10% via-white/55 to-transparent lg:block"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-white to-transparent lg:hidden"
                aria-hidden
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
