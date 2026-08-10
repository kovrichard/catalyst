import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const publicUrls = [
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/reset-password/request",
  "/privacy-policy",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

// Next serves each segment's opengraph-image.tsx at <segment>/opengraph-image
// with a generated content hash appended (e.g. /pricing/opengraph-image-15m7k7),
// so the suffix has to be part of the pattern.
const ogImageRoute = /\/opengraph-image(-[a-z0-9]+)?$/i;

// Optimistic, Edge-safe check: presence of the session cookie is enough to let
// the request through. The real session validation happens in server components
// via getUserFromSession, so this only gates page access.
export default function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const { pathname } = request.nextUrl;
  const isPublic = publicUrls.includes(pathname) || ogImageRoute.test(pathname);

  if (!sessionCookie && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/mcp|opengraph-image|.*.svg|.*.png|.*.webp|favicon.ico).*)",
  ],
};
