"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Calendar,
  Tags,
  Heart,
  Images,
  Euro,
  Users,
  Mail,
  UserCog,
  Settings,
  LogOut,
  Menu,
  MessageSquareQuote,
  MessageCircle,
  Handshake,
  FolderOpen,
  Home,
  Info,
  BookOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navGroups = [
  {
    label: "Vue d'ensemble",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/admin/accueil", label: "Accueil", icon: Home },
      { href: "/admin/notre-histoire", label: "Notre histoire", icon: BookOpen },
      { href: "/admin/a-propos", label: "À propos", icon: Info },
    ],
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/articles", label: "Articles", icon: FileText },
      { href: "/admin/evenements", label: "Événements", icon: Calendar },
      { href: "/admin/types-evenements", label: "Types événements", icon: Tags },
      { href: "/admin/actions", label: "Actions", icon: Heart },
      { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
      { href: "/admin/partenaires", label: "Partenaires", icon: Handshake },
      { href: "/admin/galerie", label: "Galerie", icon: Images },
      { href: "/admin/medias", label: "Bibliothèque médias", icon: FolderOpen },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/dons", label: "Dons", icon: Euro },
      { href: "/admin/benevoles", label: "Bénévoles", icon: Users },
      { href: "/admin/messages", label: "Messages", icon: Mail },
      { href: "/admin/newsletter", label: "WhatsApp", icon: MessageCircle },
    ],
  },
  {
    label: "Système",
    adminOnly: true,
    items: [
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: UserCog },
      { href: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
] as const;

export function AdminSidebar({ role = "EDITOR" }: { role?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = role === "ADMIN";

  const visibleGroups = navGroups.filter(
    (group) => !("adminOnly" in group && group.adminOnly) || isAdmin
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F172A] text-white shadow-lg lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10",
          "bg-gradient-to-b from-[#0F172A] via-[#132038] to-[#1A2544] text-white",
          "transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <Link href="/admin" className="group block" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-sm font-bold shadow-[0_8px_20px_rgba(20,184,166,0.35)]">
                LC
              </span>
              <div>
                <p className="text-[15px] font-semibold tracking-tight">CMS Colibris</p>
                <p className="text-[11px] text-white/50">Administration</p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {visibleGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/65 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-80" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-3 text-white/65 hover:bg-white/5 hover:text-white"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
}
