"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";
import type { FormState } from "@/lib/utils";

export type CreateApiKeyState = FormState & { key?: string };

const settingsPath = "/settings";
const maxNameLength = 64;

function failure(description: string): FormState {
  return { message: "Something went wrong", description, success: false };
}

export async function createApiKey(
  _prevState: CreateApiKeyState,
  formData: FormData
): Promise<CreateApiKeyState> {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return failure("Give the key a name so you can recognise it later.");
  }

  if (name.length > maxNameLength) {
    return failure(`Keep the name under ${maxNameLength} characters.`);
  }

  try {
    const created = await auth.api.createApiKey({
      body: { name },
      headers: await headers(),
    });

    logger.info(`Created API key ${created.id}`);
    revalidatePath(settingsPath);

    return {
      message: "API key created",
      description: "Copy it now — it is never shown again.",
      success: true,
      key: created.key,
    };
  } catch (error) {
    logger.error(`Failed to create API key: ${error}`);
    return failure("The key could not be created. Please try again.");
  }
}

export async function revokeApiKey(keyId: string): Promise<FormState> {
  try {
    await auth.api.deleteApiKey({
      body: { keyId },
      headers: await headers(),
    });

    logger.info(`Revoked API key ${keyId}`);
    revalidatePath(settingsPath);

    return {
      message: "API key revoked",
      description: "Any agent using it loses access immediately.",
      success: true,
    };
  } catch (error) {
    logger.error(`Failed to revoke API key ${keyId}: ${error}`);
    return failure("The key could not be revoked. Please try again.");
  }
}
