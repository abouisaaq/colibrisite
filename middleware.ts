import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const role = req.auth?.user?.role;
  const isStaff = !!role && STAFF_ROLES.has(role);

  if (isAdminRoute && !isStaff) {
    if (!req.auth) {
      const loginUrl = new URL("/auth/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
