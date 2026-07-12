import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisitAnalyticsChart } from "@/components/admin/visit-analytics-chart";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import type { VisitAnalytics, VisitPeriod } from "@/lib/analytics-queries";
import { cn } from "@/lib/utils";
import { Globe2, MapPin, MonitorSmartphone, Users, Eye } from "lucide-react";

const PERIODS: { value: VisitPeriod; label: string }[] = [
  { value: 7, label: "7 jours" },
  { value: 30, label: "30 jours" },
  { value: 90, label: "90 jours" },
];

function BreakdownTable({
  title,
  headers,
  rows,
  emptyMessage,
}: {
  title: string;
  headers: string[];
  rows: { cells: string[]; meta?: string }[];
  emptyMessage: string;
}) {
  return (
    <AdminPanel title={title}>
      {rows.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted-foreground sm:px-6">{emptyMessage}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={`${row.cells[0]}-${index}`}>
                {row.cells.map((cell, cellIndex) => (
                  <TableCell
                    key={`${cell}-${cellIndex}`}
                    className={cellIndex === row.cells.length - 1 ? "text-right font-medium" : ""}
                  >
                    {cell}
                    {cellIndex === 0 && row.meta ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">{row.meta}</span>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminPanel>
  );
}

export function VisitAnalyticsDashboard({
  analytics,
  activePeriod,
}: {
  analytics: VisitAnalytics;
  activePeriod: VisitPeriod;
}) {
  const statCards = [
    {
      title: "Visites totales",
      value: analytics.totalVisits.toLocaleString("fr-FR"),
      icon: Eye,
      color: "text-colibri-teal",
    },
    {
      title: "Visiteurs uniques",
      value: analytics.uniqueVisitors.toLocaleString("fr-FR"),
      icon: Users,
      color: "text-colibri-purple",
    },
    {
      title: "Pays détectés",
      value: analytics.countries.length.toLocaleString("fr-FR"),
      icon: Globe2,
      color: "text-colibri-green",
    },
    {
      title: "Appareils",
      value: analytics.devices.length.toLocaleString("fr-FR"),
      icon: MonitorSmartphone,
      color: "text-colibri-blue",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Vue d'ensemble"
        title="Statistiques de visites"
        description="Visiteurs, pays, villes et appareils sur les pages publiques du site"
        actions={
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((period) => (
              <Link
                key={period.value}
                href={`/admin/statistiques?period=${period.value}`}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  activePeriod === period.value
                    ? "rounded-full admin-btn-primary hover:opacity-95 border-transparent text-white"
                    : "border-[#E5E7EB] bg-white text-[#374151] hover:border-colibri-teal/40"
                )}
              >
                {period.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <AdminPanel key={stat.title} padded>
            <div className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <p className="text-2xl font-bold text-colibri-blue">{stat.value}</p>
          </AdminPanel>
        ))}
      </div>

      <AdminPanel title="Évolution des visites" padded>
        <VisitAnalyticsChart data={analytics.dailyVisits} />
      </AdminPanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownTable
          title="Appareils"
          headers={["Type", "Part", "Visites"]}
          emptyMessage="Aucune visite enregistrée sur cette période."
          rows={analytics.devices.map((item) => ({
            cells: [item.label, `${item.percentage}%`, item.count.toLocaleString("fr-FR")],
          }))}
        />

        <BreakdownTable
          title="Pays"
          headers={["Pays", "Part", "Visites"]}
          emptyMessage="Aucun pays détecté pour le moment."
          rows={analytics.countries.map((item) => ({
            cells: [
              item.country,
              `${item.percentage}%`,
              item.count.toLocaleString("fr-FR"),
            ],
            meta: item.countryCode ?? undefined,
          }))}
        />

        <BreakdownTable
          title="Villes"
          headers={["Ville", "Part", "Visites"]}
          emptyMessage="Aucune ville détectée pour le moment."
          rows={analytics.cities.map((item) => ({
            cells: [item.city, `${item.percentage}%`, item.count.toLocaleString("fr-FR")],
            meta: item.country ?? undefined,
          }))}
        />

        <BreakdownTable
          title="Pages les plus consultées"
          headers={["Page", "Part", "Visites"]}
          emptyMessage="Aucune page consultée sur cette période."
          rows={analytics.topPages.map((item) => ({
            cells: [item.path, `${item.percentage}%`, item.count.toLocaleString("fr-FR")],
          }))}
        />
      </div>

      <AdminPanel padded>
        <div className="flex items-start gap-2 text-sm text-[#6B7280]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-colibri-teal" />
          <p>
            Les pays et villes sont estimés à partir de l&apos;adresse IP du visiteur. En local,
            ces données peuvent rester vides. Les bots connus sont ignorés automatiquement.
          </p>
        </div>
      </AdminPanel>
    </div>
  );
}
