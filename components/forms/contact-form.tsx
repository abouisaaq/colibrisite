"use client";

import { useRef, useTransition, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { submitContact } from "@/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send, MessageCircleHeart, Clock3 } from "lucide-react";
import type { ContactPhone } from "@/lib/contact-phones";
import { phoneHref } from "@/lib/contact-phones";
import { HOME_EASE } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  email: string;
  phones: ContactPhone[];
  address: string;
  mapAddress: string;
  mapEmbedUrl?: string;
}

const DEFAULT_MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=2.365%2C48.851%2C2.395%2C48.867&layer=mapnik&marker=48.8590576%2C2.3800617";

const fieldClass =
  "mt-2 h-11 rounded-xl border-[#E8EDF3] bg-[#F8FAFC]/80 px-3.5 text-base shadow-none transition-all duration-300 placeholder:text-[#94A3B8] focus-visible:border-colibri-teal focus-visible:bg-white focus-visible:ring-colibri-teal/20 sm:text-[15px]";

function ContactInfoCard({
  icon: Icon,
  title,
  children,
  iconBg,
  glow,
  delay,
  inView,
}: {
  icon: typeof Mail;
  title: string;
  children: ReactNode;
  iconBg: string;
  glow: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: HOME_EASE }}
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border border-[#E8EDF3] bg-white p-5",
        "shadow-[0_8px_28px_rgba(15,23,42,0.04)]",
        "transition-all duration-[380ms] ease-out",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-70",
          glow
        )}
        aria-hidden
      />
      <div className="relative flex gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]",
            "transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
            iconBg
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            {title}
          </p>
          <div className="mt-1.5 text-[15px] font-medium leading-snug text-[#0F172A]">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ContactForm({
  email,
  phones,
  address,
  mapAddress,
  mapEmbedUrl,
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await submitContact(formData);
        toast.success("Message envoyé avec succès !");
        (e.target as HTMLFormElement).reset();
      } catch {
        toast.error("Erreur lors de l'envoi du message.");
      }
    });
  }

  return (
    <div ref={sectionRef} className="relative">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#14B8A6]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#8B5CF6]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: HOME_EASE }}
          className={cn(
            "relative overflow-x-clip rounded-[1.75rem] border border-[#E8EDF3] bg-white",
            "p-5 shadow-[0_16px_48px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10"
          )}
        >
          <div
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#14B8A6] via-[#3B82F6] to-[#8B5CF6]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#14B8A6]/10 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F0FDFA] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0D9488]">
              <MessageCircleHeart className="h-3.5 w-3.5" aria-hidden />
              Écrivez-nous
            </div>
            <h2 className="font-heading mt-4 text-[1.75rem] font-bold tracking-tight text-[#0F172A] sm:text-[2rem]">
              Envoyez-nous un message
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#64748B]">
              Une question, une idée ou un besoin d&apos;accompagnement ? Laissez-nous un
              message, nous vous répondons avec soin.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-[13px] font-medium text-[#334155]">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Votre nom"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[13px] font-medium text-[#334155]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="vous@email.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-[13px] font-medium text-[#334155]">
                  Sujet
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="De quoi souhaitez-vous parler ?"
                  className={fieldClass}
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-[13px] font-medium text-[#334155]">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Écrivez votre message ici..."
                  className={cn(
                    fieldClass,
                    "min-h-[140px] resize-y py-3"
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="inline-flex items-center gap-2 text-[13px] text-[#94A3B8]">
                  <Clock3 className="h-4 w-4 text-colibri-teal" aria-hidden />
                  Réponse sous 48h en moyenne
                </p>
                <Button
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className={cn(
                    "w-full rounded-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488] px-7 text-white sm:w-auto",
                    "shadow-[0_12px_28px_rgba(20,184,166,0.28)]",
                    "transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(20,184,166,0.35)]",
                    "hover:from-[#0D9488] hover:to-[#0F766E]"
                  )}
                >
                  <Send className="h-4 w-4" />
                  {isPending ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Infos + map */}
        <div className="space-y-4">
          <ContactInfoCard
            icon={Mail}
            title="Email"
            iconBg="bg-[#14B8A6]"
            glow="bg-[#14B8A6]/30"
            delay={0.08}
            inView={inView}
          >
            <a
              href={`mailto:${email}`}
              className="break-all transition-colors hover:text-colibri-teal"
            >
              {email}
            </a>
          </ContactInfoCard>

          {phones.map((phone, index) => (
            <ContactInfoCard
              key={phone.label}
              icon={Phone}
              title={phone.label}
              iconBg={index === 0 ? "bg-[#3B82F6]" : "bg-[#8B5CF6]"}
              glow={index === 0 ? "bg-[#3B82F6]/30" : "bg-[#8B5CF6]/30"}
              delay={0.14 + index * 0.06}
              inView={inView}
            >
              <a
                href={phoneHref(phone.value)}
                className="inline-flex items-center gap-2 transition-colors hover:text-colibri-teal"
                aria-label={`${phone.label} : ${phone.value}`}
              >
                <span aria-hidden>{phone.flag}</span>
                {phone.value}
              </a>
            </ContactInfoCard>
          ))}

          {address ? (
            <ContactInfoCard
              icon={MapPin}
              title="Adresse"
              iconBg="bg-[#F59E0B]"
              glow="bg-[#F59E0B]/30"
              delay={0.26}
              inView={inView}
            >
              {address}
            </ContactInfoCard>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.55, delay: 0.32, ease: HOME_EASE }}
            className={cn(
              "overflow-hidden rounded-[1.35rem] border border-[#E8EDF3] bg-white",
              "shadow-[0_8px_28px_rgba(15,23,42,0.04)]"
            )}
          >
            <div className="border-b border-[#E8EDF3] px-5 py-3.5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
                Nous trouver
              </p>
              <p className="mt-1 text-[14px] font-medium text-[#0F172A]">Sur la carte</p>
            </div>
            <div className="relative h-56 overflow-hidden bg-[#F1F5F9] sm:h-64">
              <iframe
                title={mapAddress}
                src={mapEmbedUrl?.trim() || DEFAULT_MAP_EMBED_URL}
                className="h-full w-full border-0 grayscale-[20%] contrast-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="border-t border-[#E8EDF3] px-5 py-3.5">
              <p className="inline-flex items-start gap-2 text-[13px] leading-snug text-[#64748B]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-colibri-teal" aria-hidden />
                {mapAddress}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
