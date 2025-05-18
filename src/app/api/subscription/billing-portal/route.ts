import { getUserFromSession } from "@/lib/dao/users";
import { createStripeBillingPortalUrl } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await getUserFromSession();

  return NextResponse.json({
    // url: await createStripeBillingPortalUrl(""),
    url: "https://example.com",
  });
}
