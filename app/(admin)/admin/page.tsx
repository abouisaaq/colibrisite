import {
  fetchArticles,
  fetchDonations,
  fetchEvents,
  fetchVolunteers,
} from "@/lib/convex-data";
import { formatCurrency } from "@/lib/utils";
import { FileText, Calendar, Users, Euro } from "lucide-react";
import { DashboardChart } from "@/components/admin/dashboard-chart";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

export default async function AdminDashboard() {
  const [articles, upcomingEvents, volunteers, donations] = await Promise.all([
    fetchArticles(),
    fetchEvents({ status: "UPCOMING" }),
    fetchVolunteers(),
    fetchDonations(),
  ]);

  const completedDonations = donations
    .filter((d) => d.status === "COMPLETED")
    .sort(
      (a, b) =>
        (b._creationTime as number) - (a._creationTime as number)
    );

  const recentDonations = completedDonations.slice(0, 5);
  const monthlyDonations = [...completedDonations]
    .sort(
      (a, b) =>
        (a._creationTime as number) - (b._creationTime as number)
    )
    .slice(0, 30)
    .map((d) => ({
      amount: d.amount as number,
      createdAt: new Date(d._creationTime as number),
    }));

  const totalAmount = completedDonations.reduce(
    (sum, d) => sum + (d.amount as number),
    0
  );

  const stats = [
    {
      title: "Articles",
      value: articles.length,
      icon: FileText,
      iconBg: "bg-[#3B82F6]",
      glow: "bg-[#3B82F6]/20",
    },
    {
      title: "Événements à venir",
      value: upcomingEvents.length,
      icon: Calendar,
      iconBg: "bg-[#14B8A6]",
      glow: "bg-[#14B8A6]/20",
    },
    {
      title: "Nouvelles candidatures",
      value: volunteers.filter((v) => v.status === "NEW").length,
      icon: Users,
      iconBg: "bg-[#8B5CF6]",
      glow: "bg-[#8B5CF6]/20",
    },
    {
      title: "Total des dons",
      value: formatCurrency(totalAmount),
      icon: Euro,
      iconBg: "bg-[#F59E0B]",
      glow: "bg-[#F59E0B]/20",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Vue d'ensemble"
        title="Dashboard"
        description="Suivez l'activité de l'association en un coup d'œil."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            glow={stat.glow}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Dons récents" description="Évolution des contributions" padded>
          <DashboardChart data={monthlyDonations} />
        </AdminPanel>

        <AdminPanel title="Dernières transactions" description="Les 5 derniers dons validés" padded>
          {recentDonations.length === 0 ? (
            <p className="text-sm text-[#64748B]">Aucun don pour le moment.</p>
          ) : (
            <ul className="space-y-1">
              {recentDonations.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {(d.donorName as string | undefined) ??
                        (d.donorEmail as string | undefined) ??
                        "Anonyme"}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(d._creationTime as number).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F0FDFA] px-3 py-1 text-sm font-semibold text-[#0D9488]">
                    {formatCurrency(d.amount as number)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
