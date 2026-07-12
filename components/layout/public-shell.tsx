"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { VisitTracker } from "@/components/analytics/visit-tracker";

interface PublicShellProps {
  logoUrl?: string;
  logoHeight?: number;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function PublicShell({ logoUrl, logoHeight, children, footer }: PublicShellProps) {
  const isHome = usePathname() === "/";

  return (
    <>
      <VisitTracker />
      {!isHome && <SiteHeader logoUrl={logoUrl} logoHeight={logoHeight} variant="page" />}
      <main className="flex-1 bg-white">{children}</main>
      {footer}
    </>
  );
}
