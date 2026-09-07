import { NextResponse } from "next/server";
import { getAppVersion } from "@/lib/version";

export function GET() {
  return NextResponse.json(
    { version: getAppVersion() },
    { headers: { "cache-control": "no-store" } }
  );
}
