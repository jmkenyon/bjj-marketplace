import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)"],
};

export default async function proxy(req: NextRequest) {
  const hostname = req.headers.get("host");
  const pathname = req.nextUrl.pathname;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const publicRoutes = [
    "/",
    "/drop-in",
    "/sign-up",
    "/free-trial",
    "/admin",
    "/student",
  ];

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
     LOGIN PAGES (ADMIN / STUDENT)
  ------------------------------ */
  if (pathname === "/admin" || pathname === "/student") {
    if (!isTenantDomain || !gymSlug) {
      return NextResponse.next();
    }

    // Not logged in → show login page
    if (!token) {
      return NextResponse.rewrite(
        new URL(`/gym/${gymSlug}${pathname}`, req.url)
      );
    }

    // Logged in → redirect by role
    if (token.role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", req.url)
      );
    }

    return NextResponse.redirect(
      new URL("/student/dashboard", req.url)
    );
  }

  /* -----------------------------
   ADMIN DASHBOARD (ADMIN ONLY)
------------------------------ */
if (pathname.startsWith("/admin/dashboard")) {
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/student/dashboard", req.url)
    );
  }
}

  /* -----------------------------
     PUBLIC ROUTES
  ------------------------------ */
  if (
    publicRoutes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    )
  ) {
    if (isTenantDomain && gymSlug) {
      return NextResponse.rewrite(
        new URL(`/gym/${gymSlug}${pathname}`, req.url)
      );
    }
    return NextResponse.next();
  }

  /* -----------------------------
     AUTH REQUIRED
  ------------------------------ */
  if (!isTenantDomain || !gymSlug) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token.gymSlug !== gymSlug) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.rewrite(
    new URL(`/gym/${gymSlug}${pathname}`, req.url)
  );
}