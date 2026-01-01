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

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (!hostname.endsWith(`.${rootDomain}`)) {
    return NextResponse.next();
  }

  const gymSlug = hostname.replace(`.${rootDomain}`, "");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

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
