"use server";

import { randomUUID } from "node:crypto";
import { getUserIdFromSession } from "@/lib/session";
import { userFileKey } from "@/lib/storage/file-keys";
import { generatePresignedUploadUrl } from "@/lib/storage/s3";

export type UploadTarget = {
  key: string;
  url: string;
};

export async function createUploadUrls(count: number): Promise<UploadTarget[]> {
  const userId = await getUserIdFromSession();

  const targets = await Promise.all(
    Array.from({ length: count }).map(async () => {
      const key = userFileKey(userId, randomUUID());
      const url = await generatePresignedUploadUrl(key);
      return url ? { key, url } : null;
    })
  );

  return targets.filter((target): target is UploadTarget => target !== null);
}
