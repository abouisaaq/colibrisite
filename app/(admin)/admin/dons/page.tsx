import { fetchDonations } from "@/lib/convex-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { ManualDonationForm } from "@/components/admin/manual-donation-form";
import { DeleteDonationButton } from "@/components/admin/delete-donation-button";

function statusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Reçu";
    case "PENDING":
      return "En attente";
    case "FAILED":
      return "Échoué";
    case "CANCELLED":
      return "Annulé";
    default:
      return status;
  }
}

export default async function AdminDonationsPage() {
  const donations = await fetchDonations();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Engagement"
        title="Dons"
        description="Suivi des dons — enregistrez manuellement les paiements PayPal.me"
      />

      <ManualDonationForm />

      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donateur</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Fréquence</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[52px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Aucun don enregistré pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              donations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.donorName ?? d.donorEmail ?? "Anonyme"}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(d.amount)}
                  </TableCell>
                  <TableCell>
                    {d.frequency === "ONE_TIME" ? "Ponctuel" : "Mensuel"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={d.status === "COMPLETED" ? "default" : "secondary"}
                    >
                      {statusLabel(d.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(new Date(d._creationTime))}</TableCell>
                  <TableCell>
                    <DeleteDonationButton id={d.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
