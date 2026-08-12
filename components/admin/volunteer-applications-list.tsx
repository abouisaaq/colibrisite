"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VolunteerStatusButtons } from "@/components/admin/volunteer-status-buttons";
import { AdminPanel } from "@/components/admin/admin-panel";
import { deleteVolunteer } from "@/actions/admin";
import { formatDate } from "@/lib/utils";
import {
  formatVolunteerAvailability,
  formatVolunteerDomains,
  VOLUNTEER_STATUS_LABELS,
} from "@/lib/volunteer-options";
import { Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type VolunteerApplication = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  skills: string | null;
  availability: string | null;
  domains: string | null;
  message: string | null;
  status: "NEW" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
};

function statusVariant(status: VolunteerApplication["status"]) {
  switch (status) {
    case "NEW":
      return "default" as const;
    case "REVIEWING":
      return "secondary" as const;
    case "ACCEPTED":
      return "secondary" as const;
    case "REJECTED":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function DetailItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
        {label}
      </p>
      {href && value !== "—" ? (
        <a
          href={href}
          className="mt-1 block text-sm font-medium text-colibri-teal hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm font-medium text-[#111827]">{value}</p>
      )}
    </div>
  );
}

function TagList({ items }: { items: string }) {
  if (items === "—") {
    return <p className="mt-1 text-sm text-[#6B7280]">—</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.split(", ").map((item) => (
        <Badge key={item} variant="secondary" className="bg-white text-[#374151]">
          {item}
        </Badge>
      ))}
    </div>
  );
}

function VolunteerDetailDialog({
  volunteer,
  open,
  onOpenChange,
  onDeleted,
}: {
  volunteer: VolunteerApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  if (!volunteer) return null;

  const current = volunteer;
  const availability = formatVolunteerAvailability(current.availability);
  const domains = formatVolunteerDomains(current.domains);

  function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer la candidature de ${current.firstName} ${current.lastName} ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteVolunteer(current.id);
        toast.success("Candidature supprimée");
        onOpenChange(false);
        onDeleted();
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 pr-6">
            <span>
              {current.firstName} {current.lastName}
            </span>
            <Badge variant={statusVariant(current.status)}>
              {VOLUNTEER_STATUS_LABELS[current.status] ?? current.status}
            </Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Candidature reçue le {formatDate(current.createdAt)}
          </p>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem
            label="Email"
            value={current.email}
            href={`mailto:${current.email}`}
          />
          <DetailItem
            label="Téléphone"
            value={current.phone ?? "—"}
            href={current.phone ? `tel:${current.phone}` : undefined}
          />
          <DetailItem label="Compétences" value={current.skills ?? "—"} />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
              Disponibilités
            </p>
            <TagList items={availability} />
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
              Domaines souhaités
            </p>
            <TagList items={domains} />
          </div>
        </div>

        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
            Message
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
            {current.message?.trim() || "—"}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
            <a
              href={`mailto:${current.email}`}
              className="inline-flex items-center gap-1.5 hover:text-colibri-teal"
            >
              <Mail className="h-4 w-4" />
              Contacter par email
            </a>
            {current.phone ? (
              <a
                href={`tel:${current.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-colibri-teal"
              >
                <Phone className="h-4 w-4" />
                Appeler
              </a>
            ) : null}
          </div>
          <VolunteerStatusButtons id={current.id} status={current.status} />
        </div>

        <div className="flex justify-end border-t border-[#E5E7EB] pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Supprimer la candidature
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VolunteerApplicationsList({
  volunteers: initialVolunteers,
}: {
  volunteers: VolunteerApplication[];
}) {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedVolunteer =
    volunteers.find((v) => v.id === selectedId) ?? null;

  function openVolunteer(id: string) {
    setSelectedId(id);
    setDialogOpen(true);
  }

  function handleQuickDelete(volunteer: VolunteerApplication) {
    const confirmed = window.confirm(
      `Supprimer la candidature de ${volunteer.firstName} ${volunteer.lastName} ?`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteVolunteer(volunteer.id);
        setVolunteers((prev) => prev.filter((v) => v.id !== volunteer.id));
        if (selectedId === volunteer.id) {
          setDialogOpen(false);
          setSelectedId(null);
        }
        toast.success("Candidature supprimée");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  if (volunteers.length === 0) {
    return (
      <AdminPanel>
        <div className="p-8 text-center text-sm text-muted-foreground">
          Aucune candidature bénévole pour le moment.
        </div>
      </AdminPanel>
    );
  }

  return (
    <>
      <AdminPanel
        title="Candidatures"
        description="Cliquez sur une ligne pour voir le détail complet."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[52px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow
                key={volunteer.id}
                className="cursor-pointer"
                onClick={() => openVolunteer(volunteer.id)}
              >
                <TableCell className="font-medium text-colibri-blue">
                  {volunteer.firstName} {volunteer.lastName}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {volunteer.email}
                </TableCell>
                <TableCell>{volunteer.phone ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(volunteer.status)}>
                    {VOLUNTEER_STATUS_LABELS[volunteer.status] ?? volunteer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#64748B]">
                  {formatDate(volunteer.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    aria-label={`Supprimer ${volunteer.firstName} ${volunteer.lastName}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickDelete(volunteer);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>

      <VolunteerDetailDialog
        volunteer={selectedVolunteer}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDeleted={() => {
          if (selectedId) {
            setVolunteers((prev) => prev.filter((v) => v.id !== selectedId));
            setSelectedId(null);
          }
        }}
      />
    </>
  );
}
