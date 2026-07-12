"use client";

import { useMemo, useState, useTransition } from "react";
import { Send, CheckCircle2, ChevronDown } from "lucide-react";
import { subscribeWhatsApp } from "@/actions/newsletter";
import { SectionHeader } from "@/components/home/section-header";
import { ScrollReveal, useSectionInView } from "@/components/home/scroll-reveal";
import {
  buildInternationalPhone,
  COUNTRY_DIAL_CODES,
  DEFAULT_COUNTRY_ISO,
  formatCountryOption,
  getCountryByIso,
  OTHER_COUNTRIES,
  PRIORITY_COUNTRIES,
} from "@/lib/country-codes";
import { cn } from "@/lib/utils";

function WhatsAppWatermark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface NewsletterSectionProps {
  title: string;
  subtitle: string;
}

const inputClassName =
  "h-12 w-full rounded-full border-0 bg-white/95 text-base text-[#111827] shadow-[0_4px_20px_rgba(0,0,0,0.08)] outline-none ring-2 ring-transparent placeholder:text-[#9CA3AF] focus:ring-white/50 sm:text-[15px]";

export function NewsletterSection({ title, subtitle }: NewsletterSectionProps) {
  const { ref: sectionRef, inView } = useSectionInView(0.15);
  const [name, setName] = useState("");
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [localPhone, setLocalPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedCountry = useMemo(
    () => getCountryByIso(countryIso) ?? COUNTRY_DIAL_CODES[0]!,
    [countryIso]
  );

  function resetFeedback() {
    setSuccess(false);
    setMessage("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullPhone = buildInternationalPhone(selectedCountry.dial, localPhone);

    startTransition(async () => {
      const result = await subscribeWhatsApp({ name: name.trim(), phone: fullPhone });
      setMessage(result.message);
      setSuccess(result.success);
      if (result.success) {
        setName("");
        setLocalPhone("");
      }
    });
  }

  return (
    <section ref={sectionRef} className="site-section">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#128C7E] via-[#25D366] to-[#4FD1A5] p-8 sm:p-12 lg:p-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-[60px]"
            aria-hidden
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal inView={inView} direction="left" className="relative">
              <WhatsAppWatermark className="pointer-events-none absolute -left-2 top-1/2 h-52 w-52 -translate-y-1/2 scale-[1.03] text-white/10 sm:h-64 sm:w-64 lg:-left-6 lg:h-80 lg:w-80" />
              <div className="relative z-10">
                <SectionHeader
                  eyebrow="WhatsApp"
                  title={title}
                  description={subtitle}
                  align="left"
                  light
                />
              </div>
            </ScrollReveal>

            <ScrollReveal inView={inView} direction="right" delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="whatsapp-name" className="sr-only">
                  Votre nom
                </label>
                <input
                  id="whatsapp-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    resetFeedback();
                  }}
                  placeholder="Votre nom"
                  required
                  autoComplete="name"
                  className={cn(inputClassName, "px-4")}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 gap-2">
                  <div className="relative h-12 w-16 shrink-0 sm:w-14">
                    <label htmlFor="whatsapp-country" className="sr-only">
                      Pays et indicatif
                    </label>
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-2 ring-transparent" />
                    <span
                      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center text-xl leading-none"
                      aria-hidden
                    >
                      {selectedCountry.flag}
                    </span>
                    <ChevronDown className="pointer-events-none absolute bottom-2 right-1.5 z-[1] h-3.5 w-3.5 text-[#9CA3AF]" />
                    <select
                      id="whatsapp-country"
                      value={countryIso}
                      onChange={(e) => {
                        setCountryIso(e.target.value);
                        resetFeedback();
                      }}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      aria-label="Pays et indicatif"
                    >
                      <optgroup label="Pays fréquents">
                        {PRIORITY_COUNTRIES.map((country) => (
                          <option key={country.iso} value={country.iso}>
                            {formatCountryOption(country)}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Tous les pays">
                        {OTHER_COUNTRIES.map((country) => (
                          <option key={country.iso} value={country.iso}>
                            {formatCountryOption(country)}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <label htmlFor="whatsapp-phone" className="sr-only">
                      Numéro WhatsApp
                    </label>
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6B7280]">
                      {selectedCountry.dial}
                    </span>
                    <input
                      id="whatsapp-phone"
                      type="tel"
                      value={localPhone}
                      onChange={(e) => {
                        setLocalPhone(e.target.value);
                        resetFeedback();
                      }}
                      placeholder={
                        selectedCountry.iso === "FR"
                          ? "6 12 34 56 78"
                          : "Numéro sans indicatif"
                      }
                      required
                      autoComplete="tel-national"
                      className={cn(inputClassName, "pl-[3.75rem] pr-4")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#111827] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[#1F2937] disabled:opacity-70 sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  {isPending ? "Inscription…" : "M'inscrire"}
                </button>
              </div>

              {message && (
                <p
                  className={`flex items-center gap-2 text-sm ${success ? "text-white/95" : "text-white/80"}`}
                >
                  {success && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  {message}
                </p>
              )}

              <p className="text-xs text-white/70">
                Recevez nos actualités et événements directement sur WhatsApp. Vous pouvez vous
                désinscrire à tout moment.
              </p>
            </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
