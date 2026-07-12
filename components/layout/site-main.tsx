import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SiteMainProps {
  children: ReactNode;
  className?: string;
}

/** Colonne de contenu avec marges latérales — hero, header et footer restent pleine largeur. */
export function SiteMain({ children, className }: SiteMainProps) {
  return <div className={cn("site-main", className)}>{children}</div>;
}
