import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export function CmsSectionShell({
  pageLabel,
  pageHref,
  title,
  description,
  children,
}: {
  pageLabel: string;
  pageHref: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href={pageHref}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-[#64748B] transition-colors hover:text-colibri-teal"
        >
          <ChevronLeft className="h-4 w-4" />
          {pageLabel}
        </Link>
        <AdminPageHeader eyebrow="CMS" title={title} description={description} />
      </div>
      <AdminPanel padded>{children}</AdminPanel>
    </div>
  );
}
