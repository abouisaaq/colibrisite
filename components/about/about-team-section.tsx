"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ABOUT_TEAM_INTRO,
  ABOUT_TEAM_MEMBERS,
  type AboutTeamMember,
} from "@/lib/about-content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const AVATAR_GRADIENTS = [
  "from-[#4FD1A5] via-[#42D7C8] to-[#5BB8F0]",
  "from-[#5BB8F0] via-[#6B8BFF] to-[#8B5CF6]",
  "from-[#8B5CF6] via-[#A78BFA] to-[#4FD1A5]",
  "from-[#42D7C8] via-[#4FD1A5] to-[#35D399]",
  "from-[#6B8BFF] via-[#8B5CF6] to-[#5BB8F0]",
  "from-[#4FD1A5] via-[#8B5CF6] to-[#5BB8F0]",
] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TeamMemberCard({
  member,
  index,
  inView,
}: {
  member: AboutTeamMember;
  index: number;
  inView: boolean;
}) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      className="group flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-1.5"
    >
      <div className="relative mb-6 h-[180px] w-[180px] overflow-hidden rounded-[24px] shadow-[0_8px_28px_rgba(15,23,42,0.08)] transition-shadow duration-500 group-hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)] sm:h-[220px] sm:w-[220px]">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br text-4xl font-bold text-white",
              gradient
            )}
          >
            {getInitials(member.name)}
          </div>
        )}
      </div>

      <h3 className="font-heading text-[1.75rem] font-bold leading-tight text-[#111827] transition-colors duration-300 group-hover:text-[#0d8f5f]">
        {member.name}
      </h3>
      <p className="mt-2 text-base font-semibold text-[#0d8f5f]">{member.role}</p>
      <p className="mt-2 max-w-[18rem] text-[15px] leading-snug text-[#6B7280]">
        {member.description}
      </p>
    </motion.article>
  );
}

interface AboutTeamSectionProps {
  intro?: string;
  members?: AboutTeamMember[];
}

export function AboutTeamSection({
  intro = ABOUT_TEAM_INTRO,
  members = ABOUT_TEAM_MEMBERS,
}: AboutTeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });

  return (
    <section ref={sectionRef} className="site-section bg-white">
      <div className="site-container">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
            Notre équipe
          </p>
          <h2 className="mt-3 font-heading text-[2rem] font-bold text-[#111827] sm:text-[2.25rem]">
            Des femmes et des hommes engagés
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#6B7280]">{intro}</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {members.slice(0, 6).map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
