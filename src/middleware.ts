import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicUrls = [
  "/",
  "/login",
  "/register",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

export default auth((req) => {
  if (!req.auth && !publicUrls.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*.svg|.*.png|favicon.ico).*)"],
};
