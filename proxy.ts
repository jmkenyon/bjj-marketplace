import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)"],
};

export default async function proxy(req: NextRequest) {
  const hostname = req.headers.get("host");
  const pathname = req.nextUrl.pathname;

  console.log("---- MIDDLEWARE ----");
  console.log("HOST:", hostname);
  console.log("PATH:", pathname);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  console.log("ROOT DOMAIN:", rootDomain);

  if (!hostname || !rootDomain) {
    console.log("❌ Missing hostname or rootDomain");
    return NextResponse.next();
  }

  if (pathname.startsWith("/login")) {
    console.log("✅ Login path, skipping");
    return NextResponse.next();
  }

  if (!hostname.endsWith(`.${rootDomain}`)) {
    console.log("ℹ️ Not a subdomain, skipping");
    return NextResponse.next();
  }

  const gymSlug = hostname.replace(`.${rootDomain}`, "");
  console.log("GYM SLUG FROM HOST:", gymSlug);

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("TOKEN:", token);

  if (!token) {
    console.log("❌ No token → redirect login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token.gymSlug !== gymSlug) {
    console.log("❌ Gym mismatch", token.gymSlug, gymSlug);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("✅ Authorized → rewrite");
  return NextResponse.rewrite(
    new URL(`/gym/${gymSlug}${pathname}`, req.url)
  );
}