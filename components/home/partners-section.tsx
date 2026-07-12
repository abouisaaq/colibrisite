"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/home/section-header";
import { ScrollReveal, StaggerReveal, useSectionInView } from "@/components/home/scroll-reveal";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
}

interface PartnersSectionProps {
  title: string;
  subtitle: string;
  partners: Partner[];
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const content = (
    <div className="flex h-[96px] w-full items-center justify-center rounded-2xl border border-[#E5E7EB]/60 bg-white px-8 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#42D7C8]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:h-[104px]">
      <div className="relative h-12 w-full max-w-[180px] sm:h-14 sm:max-w-[200px]">
        <Image
          src={partner.logoUrl}
          alt={partner.name}
          fill
          sizes="200px"
          className="object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        aria-label={partner.name}
      >
        {content}
      </a>
    );
  }

  return <div className="group">{content}</div>;
}

export function PartnersSection({ title, subtitle, partners }: PartnersSectionProps) {
  const { ref: sectionRef, inView } = useSectionInView(0.15);

  if (partners.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="site-section bg-[#F8FAFC]"
    >
      <div className="site-container">
        <ScrollReveal inView={inView} direction="up">
          <SectionHeader
            eyebrow="Partenaires"
            title={title}
            description={subtitle}
            align="center"
            className="mb-10 max-w-2xl"
          />
        </ScrollReveal>

        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-5 lg:gap-8">
          {partners.map((partner, index) => (
            <StaggerReveal
              key={partner.id}
              index={index}
              inView={inView}
              direction="up"
              delayStep={0.08}
              baseDelay={0.12}
              className="w-[calc(50%-0.625rem)] sm:w-[220px] lg:w-[240px]"
            >
              <PartnerLogo partner={partner} />
            </StaggerReveal>
          ))}
        </div>

        <ScrollReveal inView={inView} direction="up" delay={0.25} className="mt-8 text-center">
          <p className="text-sm text-[#9CA3AF]">
            Vous souhaitez devenir partenaire ?{" "}
            <Link href="/contact" className="font-semibold text-[#42D7C8] hover:text-[#3CCB8A]">
              Contactez-nous
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
