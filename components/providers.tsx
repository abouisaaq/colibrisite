"use client";

import { SessionProvider } from "next-auth/react";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </SessionProvider>
  );
}
