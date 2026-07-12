import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <div className="admin-shell min-h-screen">
      <div className="admin-shell-glow admin-shell-glow-a" aria-hidden />
      <div className="admin-shell-glow admin-shell-glow-b" aria-hidden />
      <AdminSidebar role={session?.user?.role ?? "EDITOR"} />
      <div className="relative lg:pl-72">
        <main className="admin-main px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
