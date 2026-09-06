import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import conf from "@/lib/config";

let client: S3Client | null = null;

if (conf.s3Configured) {
  client = new S3Client({ region: conf.s3Region });
}

export function getS3Client(): S3Client | null {
  return client;
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("S3 storage is not configured.");
    this.name = this.constructor.name;
  }
}

export function requireS3Client(): S3Client {
  if (!client) {
    throw new StorageNotConfiguredError();
  }

  return client;
}
