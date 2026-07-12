import { Badge } from "@/components/ui/badge";
import { VolunteerStatusButtons } from "@/components/admin/volunteer-status-buttons";
import { formatDate } from "@/lib/utils";
import {
  formatVolunteerAvailability,
  formatVolunteerDomains,
  VOLUNTEER_STATUS_LABELS,
} from "@/lib/volunteer-options";
import { Mail, Phone } from "lucide-react";

type VolunteerApplication = {
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

export function VolunteerApplicationsList({
  volunteers,
}: {
  volunteers: VolunteerApplication[];
}) {
  if (volunteers.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-muted-foreground">
        Aucune candidature bénévole pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {volunteers.map((volunteer) => {
        const availability = formatVolunteerAvailability(volunteer.availability);
        const domains = formatVolunteerDomains(volunteer.domains);

        return (
          <article
            key={volunteer.id}
            className="rounded-xl border bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-6"
          >
            <div className="flex flex-col gap-4 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-colibri-blue">
                  {volunteer.firstName} {volunteer.lastName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Candidature reçue le {formatDate(volunteer.createdAt)}
                </p>
              </div>
              <Badge variant={statusVariant(volunteer.status)}>
                {VOLUNTEER_STATUS_LABELS[volunteer.status] ?? volunteer.status}
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailItem
                label="Email"
                value={volunteer.email}
                href={`mailto:${volunteer.email}`}
              />
              <DetailItem
                label="Téléphone"
                value={volunteer.phone ?? "—"}
                href={volunteer.phone ? `tel:${volunteer.phone}` : undefined}
              />
              <DetailItem label="Compétences" value={volunteer.skills ?? "—"} />
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
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

            <div className="mt-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
                {volunteer.message?.trim() || "—"}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
                <a
                  href={`mailto:${volunteer.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-colibri-teal"
                >
                  <Mail className="h-4 w-4" />
                  Contacter par email
                </a>
                {volunteer.phone ? (
                  <a
                    href={`tel:${volunteer.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-colibri-teal"
                  >
                    <Phone className="h-4 w-4" />
                    Appeler
                  </a>
                ) : null}
              </div>
              <VolunteerStatusButtons id={volunteer.id} status={volunteer.status} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
