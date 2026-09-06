import "server-only";

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as signCloudFrontUrl } from "@aws-sdk/cloudfront-signer";
import { getSignedUrl as presignUrl } from "@aws-sdk/s3-request-presigner";
import conf from "@/lib/config";
import { getS3Client, requireS3Client } from "@/lib/storage/s3-client";

// S3 rejects a DeleteObjects request carrying more than this many keys.
const MAX_KEYS_PER_DELETE = 1000;

const PRESIGNED_UPLOAD_TTL_SECONDS = 10 * 60;
const SIGNED_READ_TTL_SECONDS = 60 * 60;

export async function putObject(key: string, body: Buffer, contentType: string) {
  await requireS3Client().send(
    new PutObjectCommand({
      Bucket: conf.s3Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function getObjectBytes(key: string): Promise<Buffer | null> {
  const client = getS3Client();
  if (!client) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({ Bucket: conf.s3Bucket, Key: key })
    );
    if (!response.Body) {
      return null;
    }
    return Buffer.from(await response.Body.transformToByteArray());
  } catch (error) {
    if (isMissingObject(error)) {
      return null;
    }
    throw error;
  }
}

export async function getObjectSize(key: string): Promise<number | null> {
  const client = getS3Client();
  if (!client) {
    return null;
  }

  try {
    const response = await client.send(
      new HeadObjectCommand({ Bucket: conf.s3Bucket, Key: key })
    );
    return response.ContentLength ?? null;
  } catch (error) {
    if (isMissingObject(error)) {
      return null;
    }
    throw error;
  }
}

export async function deleteObject(key: string) {
  const client = getS3Client();
  if (!client) {
    return;
  }

  await client.send(new DeleteObjectCommand({ Bucket: conf.s3Bucket, Key: key }));
}

export async function deleteObjectsUnderPrefix(prefix: string) {
  const client = getS3Client();
  if (!client) {
    return;
  }

  const { Contents } = await client.send(
    new ListObjectsV2Command({ Bucket: conf.s3Bucket, Prefix: `${prefix}/` })
  );

  const keys = (Contents ?? [])
    .map(({ Key }) => Key)
    .filter((Key): Key is string => Boolean(Key));

  for (let start = 0; start < keys.length; start += MAX_KEYS_PER_DELETE) {
    const batch = keys.slice(start, start + MAX_KEYS_PER_DELETE);
    const { Errors } = await client.send(
      new DeleteObjectsCommand({
        Bucket: conf.s3Bucket,
        Delete: { Objects: batch.map((Key) => ({ Key })) },
      })
    );
    failLoudlyOn(Errors);
  }
}

export async function copyObject(sourceKey: string, destinationKey: string) {
  await requireS3Client().send(
    new CopyObjectCommand({
      Bucket: conf.s3Bucket,
      CopySource: `${conf.s3Bucket}/${sourceKey}`,
      Key: destinationKey,
    })
  );
}

export async function generatePresignedUploadUrl(
  key: string,
  expiresInSeconds = PRESIGNED_UPLOAD_TTL_SECONDS
): Promise<string | null> {
  const client = getS3Client();
  if (!client) {
    return null;
  }

  const command = new PutObjectCommand({ Bucket: conf.s3Bucket, Key: key });
  return presignUrl(client, command, { expiresIn: expiresInSeconds });
}

export function getSignedFileUrl(
  key: string,
  expiresInSeconds = SIGNED_READ_TTL_SECONDS
): string | null {
  if (!conf.cdnSigningEnabled) {
    return null;
  }

  return signCloudFrontUrl({
    url: `https://${conf.cdnDistributionDomain}/${key}`,
    keyPairId: conf.cdnKeyPairId,
    privateKey: conf.cdnPrivateKey,
    dateLessThan: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
  });
}

// DeleteObjects reports per-key failures in its response body rather than
// rejecting, so a partial failure has to be re-raised for callers that treat
// a throw as "cleanup did not happen".
function failLoudlyOn(errors: { Key?: string; Message?: string }[] | undefined) {
  if (!errors || errors.length === 0) {
    return;
  }

  const detail = errors.map((error) => `${error.Key}: ${error.Message}`).join("; ");
  throw new Error(`S3 delete failed for ${errors.length} object(s): ${detail}`);
}

function isMissingObject(error: unknown): boolean {
  const name = error instanceof Error ? error.name : "";
  return name === "NoSuchKey" || name === "NotFound";
}
