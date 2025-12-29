import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

  // Only handle gym subdomains
  if (!hostname.endsWith(`.${rootDomain}`)) {
    return NextResponse.next();
  }

  const gymSlug = hostname.replace(`.${rootDomain}`, "");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in but wrong gym
  if (token.gymSlug !== gymSlug) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Authorized → rewrite
  const url = req.nextUrl;
  return NextResponse.rewrite(
    new URL(`/gym/${gymSlug}${url.pathname}`, req.url)
  );
}