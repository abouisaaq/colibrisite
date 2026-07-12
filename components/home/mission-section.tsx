"use client";

import Image from "next/image";
import { Heart, HandHeart, Users, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";
import { ScrollReveal, StaggerReveal, useSectionInView } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

interface MissionSectionProps {
  title: string;
  text: string;
  quote: string;
  images: {
    main: string;
    left: string;
    right: string;
  };
}

const MISSION_QUOTE_DEFAULT =
  "Chaque geste, aussi petit soit-il, peut changer une vie.";

const points = [
  {
    icon: Heart,
    text: "Accompagner les familles les plus vulnérables",
    iconColor: "text-[#0d8f5f]",
    bg: "bg-[#3CCB8A]/10",
    hoverCard: "hover:border-[#3CCB8A]/40 hover:bg-[#3CCB8A]/14",
    hoverIconBg: "group-hover:bg-[#3CCB8A]",
    hoverIconColor: "group-hover:text-white",
  },
  {
    icon: HandHeart,
    text: "Apporter un soutien concret et durable",
    iconColor: "text-[#2B7DE9]",
    bg: "bg-[#42D7C8]/10",
    hoverCard: "hover:border-[#42D7C8]/40 hover:bg-[#42D7C8]/14",
    hoverIconBg: "group-hover:bg-[#42D7C8]",
    hoverIconColor: "group-hover:text-white",
  },
  {
    icon: Users,
    text: "Créer des liens entre les communautés",
    iconColor: "text-[#4A8BFF]",
    bg: "bg-[#4A8BFF]/10",
    hoverCard: "hover:border-[#4A8BFF]/40 hover:bg-[#4A8BFF]/14",
    hoverIconBg: "group-hover:bg-[#4A8BFF]",
    hoverIconColor: "group-hover:text-white",
  },
  {
    icon: Sparkles,
    text: "Redonner espoir et dignité à chacun",
    iconColor: "text-[#6B4EFF]",
    bg: "bg-[#6B4EFF]/10",
    hoverCard: "hover:border-[#6B4EFF]/40 hover:bg-[#6B4EFF]/14",
    hoverIconBg: "group-hover:bg-[#6B4EFF]",
    hoverIconColor: "group-hover:text-white",
  },
];

const missionCollage = {
  main: { alt: "Bénévoles accompagnant une famille" },
  bottomLeft: { alt: "Enfants en activité éducative" },
  bottomRight: { alt: "Enfants souriants" },
};

function MissionPhotoFrame({
  src,
  alt,
  className,
  imageClassName,
  imageClassNames,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imageClassNames?: string;
}) {
  return (
    <div
      className={cn(
        "group/photo overflow-hidden bg-white",
        "transition-all duration-[400ms] ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(15,23,42,0.16)]",
        className
      )}
    >
      <div className={cn("relative w-full", imageClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width:1024px) 45vw, 280px"
          className={cn(
            "object-cover transition-transform duration-[400ms] ease-out",
            "group-hover/photo:scale-[1.08]",
            imageClassNames
          )}
        />
      </div>
    </div>
  );
}

export function MissionSection({ title, text, quote, images }: MissionSectionProps) {
  const { ref: sectionRef, inView } = useSectionInView(0.12);

  return (
    <section ref={sectionRef} className="site-section relative bg-white">
      <div className="site-container relative">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <ScrollReveal inView={inView} direction="left" className="flex flex-col">
            <div className="relative">
              <div
                className="pointer-events-none absolute -left-8 -top-6 h-40 w-40 rounded-full bg-[#3CCB8A] opacity-[0.07] blur-[70px]"
                aria-hidden
              />
              <SectionHeader eyebrow="Qui sommes-nous" title={title} align="left" />
            </div>

            <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-[#6B7280]">
              {text}
            </p>

            <blockquote className="mission-quote-card relative mt-8 max-w-lg overflow-hidden px-5 py-5 sm:px-8 sm:py-7">
              <span
                className="pointer-events-none absolute -left-2 top-0 font-heading text-[5rem] leading-none text-[#3CCB8A]/[0.07] select-none sm:text-[8rem]"
                aria-hidden
              >
                &ldquo;
              </span>
              <span
                className="pointer-events-none absolute -right-2 bottom-0 font-heading text-[5rem] leading-none text-[#6B4EFF]/[0.06] select-none sm:text-[8rem]"
                aria-hidden
              >
                &rdquo;
              </span>
              <p className="relative z-10 font-heading text-[22px] italic leading-[1.45] text-[#1B2233] sm:text-[28px] sm:leading-[1.5]">
                {quote || MISSION_QUOTE_DEFAULT}
              </p>
            </blockquote>

            <div className="relative mt-10">
              <div
                className="pointer-events-none absolute -right-4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#4A8BFF] opacity-[0.06] blur-[80px]"
                aria-hidden
              />
              <div className="relative grid gap-3 sm:grid-cols-2">
                {points.map((point, index) => (
                  <StaggerReveal
                    key={point.text}
                    index={index}
                    inView={inView}
                    direction={index % 2 === 0 ? "left" : "right"}
                    delayStep={0.1}
                    baseDelay={0.2}
                  >
                  <div
                    className={cn(
                      "group flex items-start gap-3 rounded-2xl border border-[#E5E7EB]/70 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
                      "transition-all duration-300 ease-out",
                      "hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]",
                      point.hoverCard
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        point.bg,
                        point.hoverIconBg
                      )}
                    >
                      <point.icon
                        className={cn(
                          "h-[22px] w-[22px] transition-colors duration-300",
                          point.iconColor,
                          point.hoverIconColor
                        )}
                        strokeWidth={1.75}
                      />
                    </div>
                    <span className="pt-4 text-[14px] font-medium leading-snug text-[#111827]">
                      {point.text}
                    </span>
                  </div>
                  </StaggerReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="relative flex justify-center lg:h-full lg:items-center lg:justify-center">
            <div
              className="pointer-events-none absolute inset-0 rounded-full bg-[#6B4EFF] opacity-[0.06] blur-[90px]"
              aria-hidden
            />
            <ScrollReveal
              inView={inView}
              direction="right"
              delay={0.08}
              className="relative mx-auto w-full max-w-[540px] pb-14 sm:pb-16 lg:max-w-none"
            >
              <div className="relative w-full">
                <MissionPhotoFrame
                  src={images.main}
                  alt={missionCollage.main.alt}
                  className="rounded-[28px] border border-[#E5E7EB]/80 shadow-[0_20px_56px_rgba(15,23,42,0.09)]"
                  imageClassName="aspect-[5/4]"
                />

                <div className="absolute left-0 top-[calc(100%-22%)] z-20 w-[46%] -rotate-[2.5deg] transition-transform duration-[400ms] ease-out hover:-translate-y-2 hover:-rotate-[4deg] sm:left-1">
                  <MissionPhotoFrame
                    src={images.left}
                    alt={missionCollage.bottomLeft.alt}
                    className="rounded-[22px] border-[5px] border-white shadow-[0_18px_44px_rgba(15,23,42,0.14)]"
                    imageClassName="aspect-[4/3]"
                    imageClassNames="saturate-[0.88]"
                  />
                </div>

                <div className="absolute right-0 top-[calc(100%-20%)] z-30 w-[46%] rotate-[2.5deg] transition-transform duration-[400ms] ease-out hover:-translate-y-2 hover:rotate-[4deg] sm:right-1">
                  <MissionPhotoFrame
                    src={images.right}
                    alt={missionCollage.bottomRight.alt}
                    className="rounded-[22px] border-[5px] border-white shadow-[0_18px_44px_rgba(15,23,42,0.14)]"
                    imageClassName="aspect-[4/3]"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
