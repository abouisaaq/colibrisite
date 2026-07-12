"use client";

import { useRef, useTransition, type ReactNode } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Check, Heart } from "lucide-react";
import { submitVolunteer } from "@/actions/public";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  VOLUNTEER_AVAILABILITY_OPTIONS,
  VOLUNTEER_DOMAIN_OPTIONS,
  VOLUNTEER_HERO_IMAGE,
  VOLUNTEER_WHY_POINTS,
} from "@/lib/volunteer-options";

const EASE = [0.22, 1, 0.36, 1] as const;

const fieldClassName =
  "mt-1.5 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-base text-[#111827] shadow-[0_2px_8px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#4FD1A5]/60 focus:ring-2 focus:ring-[#4FD1A5]/20 sm:text-sm";

const textareaClassName =
  "mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] shadow-[0_2px_8px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#4FD1A5]/60 focus:ring-2 focus:ring-[#4FD1A5]/20 sm:text-sm";

interface VolunteerFormProps {
  volunteersCount?: string;
  familiesCount?: string;
  projectsCount?: string;
  imageUrl?: string;
}

function CheckboxCard({
  name,
  value,
  label,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm font-medium text-[#374151] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-colors has-[:checked]:border-[#4FD1A5] has-[:checked]:bg-[#4FD1A5]/10 has-[:checked]:text-[#0d8f5f]">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[#D1D5DB] text-[#0D9488] focus:ring-[#4FD1A5]/30"
      />
      {label}
    </label>
  );
}

function MotionField({
  children,
  inView,
  delay,
}: {
  children: ReactNode;
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.8, ease: EASE, delay: inView ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}

export function VolunteerForm({
  volunteersCount = "100",
  familiesCount = "500",
  projectsCount = "50",
  imageUrl,
}: VolunteerFormProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [isPending, startTransition] = useTransition();

  const formattedVolunteers = Number(volunteersCount).toLocaleString("fr-FR");
  const formattedFamilies = Number(familiesCount).toLocaleString("fr-FR");
  const formattedProjects = Number(projectsCount).toLocaleString("fr-FR");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await submitVolunteer(formData);
        toast.success("Candidature envoyée ! Nous vous recontacterons bientôt.");
        form.reset();
      } catch {
        toast.error("Erreur lors de l'envoi de la candidature.");
      }
    });
  }

  return (
    <div
      ref={sectionRef}
      className="grid items-stretch gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12"
    >
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, x: -56 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -56 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="relative min-h-[280px] overflow-hidden rounded-[32px] shadow-[0_16px_48px_rgba(15,23,42,0.1)] sm:min-h-[360px] lg:min-h-[420px]">
          <Image
            src={imageUrl || VOLUNTEER_HERO_IMAGE}
            alt="Bénévoles engagés lors d'une action solidaire"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>

        <motion.div
          className="-mt-8 relative z-10 mx-2 rounded-[24px] border border-[#E5E7EB]/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:mx-4 sm:p-6 lg:mt-[-2.5rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: EASE, delay: inView ? 0.15 : 0 }}
        >
          <p className="text-sm font-semibold text-[#111827]">
            <span aria-hidden>❤️</span> Pourquoi devenir bénévole ?
          </p>

          <ul className="mt-4 space-y-2.5">
            {VOLUNTEER_WHY_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-[#374151]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#35D399]" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#F8FAFC] px-3 py-3 text-center">
              <p className="text-lg font-bold text-[#111827]">👥 {formattedVolunteers}+</p>
              <p className="mt-1 text-xs text-[#6B7280]">bénévoles</p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] px-3 py-3 text-center">
              <p className="text-lg font-bold text-[#111827]">❤️ {formattedFamilies}+</p>
              <p className="mt-1 text-xs text-[#6B7280]">familles accompagnées</p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] px-3 py-3 text-center">
              <p className="text-lg font-bold text-[#111827]">🎯 {formattedProjects}+</p>
              <p className="mt-1 text-xs text-[#6B7280]">actions chaque année</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 56 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 56 }}
        transition={{ duration: 0.8, ease: EASE, delay: inView ? 0.08 : 0 }}
      >
        <form
          onSubmit={handleSubmit}
          className="h-full rounded-[32px] border border-[#E5E7EB]/80 bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
            Devenir bénévole
          </p>
          <h2 className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#111827] sm:text-[2rem]">
            Rejoignez notre équipe
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#6B7280]">
            Quelques heures de votre temps peuvent changer une vie.
          </p>

          <div className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <MotionField inView={inView} delay={0.12}>
                <label htmlFor="firstName" className="text-[13px] font-semibold text-[#374151]">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  className={fieldClassName}
                  placeholder="Votre prénom"
                />
              </MotionField>

              <MotionField inView={inView} delay={0.16}>
                <label htmlFor="lastName" className="text-[13px] font-semibold text-[#374151]">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  className={fieldClassName}
                  placeholder="Votre nom"
                />
              </MotionField>
            </div>

            <MotionField inView={inView} delay={0.2}>
              <label htmlFor="email" className="text-[13px] font-semibold text-[#374151]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={fieldClassName}
                placeholder="votre@email.com"
              />
            </MotionField>

            <MotionField inView={inView} delay={0.24}>
              <label htmlFor="phone" className="text-[13px] font-semibold text-[#374151]">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={fieldClassName}
                placeholder="+33 6 00 00 00 00"
              />
            </MotionField>

            <MotionField inView={inView} delay={0.28}>
              <label htmlFor="skills" className="text-[13px] font-semibold text-[#374151]">
                Compétences
              </label>
              <input
                id="skills"
                name="skills"
                className={fieldClassName}
                placeholder="Ex : cuisine, informatique, animation..."
              />
            </MotionField>

            <MotionField inView={inView} delay={0.32}>
              <p className="text-[13px] font-semibold text-[#374151]">Disponibilités</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {VOLUNTEER_AVAILABILITY_OPTIONS.map((option) => (
                  <CheckboxCard
                    key={option.value}
                    name="availability"
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </div>
            </MotionField>

            <MotionField inView={inView} delay={0.36}>
              <p className="text-[13px] font-semibold text-[#374151]">Domaines souhaités</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {VOLUNTEER_DOMAIN_OPTIONS.map((option) => (
                  <CheckboxCard
                    key={option.value}
                    name="domains"
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </div>
            </MotionField>

            <MotionField inView={inView} delay={0.4}>
              <label htmlFor="message" className="text-[13px] font-semibold text-[#374151]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className={textareaClassName}
                placeholder="Parlez-nous de votre motivation..."
              />
            </MotionField>

            <MotionField inView={inView} delay={0.44}>
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "relative mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4FD1A5] via-[#5BB8F0] to-[#8B5CF6] text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(79,209,165,0.32)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                <Heart className="h-4 w-4 fill-white text-white" strokeWidth={0} />
                {isPending ? "Envoi en cours..." : "❤️ Rejoindre les Colibris"}
              </button>
            </MotionField>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
