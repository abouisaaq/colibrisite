import { fetchDonations } from "@/lib/convex-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminDonationsPage() {
  const donations = await fetchDonations();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Engagement"
        title="Dons"
        description="Historique des dons PayPal"
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donateur</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Fréquence</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.donorName ?? d.donorEmail ?? "Anonyme"}</TableCell>
                <TableCell className="font-medium">{formatCurrency(d.amount)}</TableCell>
                <TableCell>{d.frequency === "ONE_TIME" ? "Ponctuel" : "Mensuel"}</TableCell>
                <TableCell>
                  <Badge variant={d.status === "COMPLETED" ? "default" : "secondary"}>{d.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(new Date(d._creationTime))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
