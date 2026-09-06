import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/session";
import { isOwnedFileKey } from "@/lib/storage/file-keys";
import { getSignedFileUrl } from "@/lib/storage/s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mints a short-lived signed CloudFront URL per request and redirects to it, so
// clients can persist the stable `/api/files/<key>` path and never hold a URL
// that expires out from under them.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const user = await getOptionalUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { key: segments } = await params;
  const key = segments.join("/");

  if (!isOwnedFileKey(key, user.id)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const signedUrl = getSignedFileUrl(key);
  if (!signedUrl) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(signedUrl, 302);
}
