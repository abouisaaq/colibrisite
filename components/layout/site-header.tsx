"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { SiteLogo } from "@/components/brand/site-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/notre-histoire", label: "Notre histoire" },
  { href: "/a-propos", label: "À propos" },
  { href: "/actualites", label: "Actualités" },
  { href: "/evenements", label: "Événements" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

const donateBtnClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4FD1A5] via-[#5BB8F0] to-[#8B5CF6] font-semibold text-white shadow-[0_10px_28px_rgba(79,209,165,0.32)] transition-transform duration-300 hover:scale-[1.02]";

interface SiteHeaderProps {
  logoUrl?: string;
  logoHeight?: number;
  /** hero = transparent, au-dessus du hero uniquement, défile avec la page */
  variant?: "hero" | "page";
}

export function SiteHeader({
  logoUrl,
  logoHeight = 44,
  variant = "page",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHero = variant === "hero";
  const mobileLogoHeight = Math.min(logoHeight, 40);
  const mobileLogoMaxWidth = Math.min(Math.round(mobileLogoHeight * 3.2), 148);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const navContent = (
    <>
      <div className="relative grid h-[64px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:h-[72px] lg:grid-cols-[auto_1fr_auto] lg:gap-4">
        <Link
          href="/"
          className="flex min-w-0 max-w-[55vw] shrink items-center overflow-hidden sm:max-w-none"
        >
          <span className="lg:hidden">
            <SiteLogo
              logoUrl={logoUrl}
              height={mobileLogoHeight}
              maxWidth={mobileLogoMaxWidth}
            />
          </span>
          <span className="hidden lg:inline-flex">
            <SiteLogo
              logoUrl={logoUrl}
              height={logoHeight}
              maxWidth={Math.round(logoHeight * 4.5)}
            />
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-semibold tracking-wide xl:text-[14px]",
                  isHero
                    ? isActive
                      ? "header-on-hero-text-accent"
                      : "header-on-hero-text-muted"
                    : isActive
                      ? "text-[#0d8f5f]"
                      : "text-[#1F2937] hover:bg-black/[0.04] hover:text-[#111827]"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#3CCB8A] to-[#4A8BFF]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <Link
            href="/faire-un-don"
            className={cn(donateBtnClass, "hidden h-10 px-5 text-[13px] lg:inline-flex")}
          >
            <Heart className="h-3.5 w-3.5 fill-white" strokeWidth={0} />
            Faire un don
          </Link>
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden",
              open
                ? "text-[#111827] hover:bg-black/5"
                : isHero
                  ? "bg-white/90 text-[#111827] shadow-[0_2px_12px_rgba(15,23,42,0.12)] backdrop-blur-md hover:bg-white"
                  : "text-[#111827] hover:bg-black/5"
            )}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto border-t border-[#E5E7EB]/80 bg-white py-3 lg:hidden">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-3 text-[15px] font-semibold",
                  isActive
                    ? "bg-[#3CCB8A]/10 text-[#0d8f5f]"
                    : "text-[#374151] hover:bg-black/5 hover:text-[#111827]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/faire-un-don"
            onClick={() => setOpen(false)}
            className={cn(donateBtnClass, "mt-2 h-12 w-full text-[15px]")}
          >
            <Heart className="h-4 w-4 fill-white" strokeWidth={0} />
            Faire un don
          </Link>
        </nav>
      ) : null}
    </>
  );

  if (isHero) {
    return (
      <header
        className={cn(
          "absolute inset-x-0 top-0 z-30 w-full hero-header-mobile-light",
          open && "border-b border-[#E5E7EB]/80 bg-white shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
        )}
      >
        <div className="site-container">{navContent}</div>
      </header>
    );
  }

  return (
    <header className="relative z-20 w-full border-b border-[#E5E7EB]/80 bg-white shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
      <div className="site-container">{navContent}</div>
    </header>
  );
}
