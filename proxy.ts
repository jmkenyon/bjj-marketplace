import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)"],
};



export default async function proxy(req: NextRequest) {
  const hostname = req.headers.get("host");
  const pathname = req.nextUrl.pathname;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (!hostname || !rootDomain) {
    return NextResponse.next();
  }

  const isTenantDomain = hostname.endsWith(`.${rootDomain}`);
  const gymSlug = isTenantDomain
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /* -----------------------------
     STUDENT DASHBOARD (ROOT ONLY)
  ------------------------------ */
  if (pathname.startsWith("/student/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Students should NEVER be on tenant domains
    if (isTenantDomain) {
      const url = req.nextUrl.clone();
      url.hostname = rootDomain;
      url.pathname = "/student/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  /* -----------------------------
     ADMIN LOGIN PAGE
  ------------------------------ */
  if (pathname === "/admin") {
    if (!isTenantDomain || !gymSlug) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.rewrite(new URL(`/gym/${gymSlug}/admin`, req.url));
    }

    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/student/dashboard", req.url));
  }

  /* -----------------------------
     ADMIN DASHBOARD (ADMIN ONLY)
  ------------------------------ */
  if (pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_APP_URL}/login1`, req.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }

    if (!isTenantDomain || token.gymSlug !== gymSlug) {
      return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_APP_URL}/login2`, req.url));
    }
  }

  /* -----------------------------
     PUBLIC ROUTES
  ------------------------------ */
  const publicRoutes = ["/", "/drop-in"];

  if (
    publicRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    if (isTenantDomain && gymSlug) {
      return NextResponse.rewrite(
        new URL(`/gym/${gymSlug}${pathname}`, req.url)
      );
    }

    return NextResponse.next();
  }

  /* -----------------------------
     DEFAULT TENANT REWRITE
  ------------------------------ */
  if (isTenantDomain && gymSlug) {
    return NextResponse.rewrite(new URL(`/gym/${gymSlug}${pathname}`, req.url));
  }

  return NextResponse.next();
}
