import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";

const results = [
  "Plus de 2 500 familles accompagnées depuis notre création",
  "120 enfants bénéficient d'un soutien scolaire gratuit",
  "15 000 repas distribués chaque année",
  "32 partenaires institutionnels et privés",
  "45 projets menés sur le terrain en 2025",
  "180 bénévoles engagés au quotidien",
];

export function ResultsSection() {
  return (
    <section className="site-section bg-white">
      <div className="site-container">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative h-[380px] overflow-hidden rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:h-[460px] lg:h-[520px]">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=80"
                alt="Enfant souriant"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl bg-gradient-premium p-5 text-white shadow-premium-btn sm:block">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm font-medium text-white/90">Transparence</p>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Impact"
              title="Des résultats concrets"
              description="Chaque action sur le terrain produit des résultats mesurables et transforme concrètement la vie des familles que nous accompagnons."
              align="left"
            />
            <ul className="mt-10 space-y-4">
              {results.map((result) => (
                <li key={result} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3CCB8A]" strokeWidth={1.75} />
                  <span className="text-[15px] leading-relaxed text-[#374151]">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
