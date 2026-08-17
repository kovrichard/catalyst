import type { AuthInfo } from "@modelcontextprotocol/server";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";

const mcpClientId = "catalyst-mcp";
const fallbackRetryAfterSeconds = 60;

// Better Auth answers both of these with TOO_MANY_REQUESTS, but verifyApiKey
// reports the code and drops the status, so the codes are what we can match on.
const rateLimitMessages: Record<string, string> = {
  RATE_LIMITED: "Rate limit exceeded.",
  USAGE_EXCEEDED: "This API key has reached its usage limit.",
};

export type McpAuthOutcome =
  | { kind: "authenticated"; authInfo: AuthInfo }
  | { kind: "unauthenticated" }
  | { kind: "rate-limited"; retryAfterSeconds: number; message: string };

type VerifyApiKeyError = {
  code?: string | null;
  details?: unknown;
};

function bearerTokenFromRequest(request: Request): string | undefined {
  const [scheme, token] = request.headers.get("Authorization")?.split(" ") ?? [];
  return scheme?.toLowerCase() === "bearer" ? token : undefined;
}

function retryAfterSecondsFrom(error: VerifyApiKeyError): number {
  const { tryAgainIn } = (error.details ?? {}) as { tryAgainIn?: unknown };

  if (typeof tryAgainIn !== "number" || tryAgainIn <= 0) {
    return fallbackRetryAfterSeconds;
  }

  return Math.ceil(tryAgainIn / 1000);
}

function rateLimitOutcome(error: VerifyApiKeyError): McpAuthOutcome | undefined {
  const message = error.code ? rateLimitMessages[error.code] : undefined;

  if (!message) return undefined;

  return {
    kind: "rate-limited",
    retryAfterSeconds: retryAfterSecondsFrom(error),
    message,
  };
}

/**
 * Resolves a request's bearer token to the user it acts for, keeping a
 * throttled key distinguishable from an invalid one. Today the only branch is a
 * Better Auth API key; an OAuth access token becomes a second branch here,
 * leaving the tool and DAO layers untouched.
 */
export async function authenticateMcpRequest(request: Request): Promise<McpAuthOutcome> {
  const bearerToken = bearerTokenFromRequest(request);

  if (!bearerToken) return { kind: "unauthenticated" };

  try {
    const { valid, key, error } = await auth.api.verifyApiKey({
      body: { key: bearerToken },
    });

    const rateLimited = error ? rateLimitOutcome(error) : undefined;
    if (rateLimited) return rateLimited;

    if (!valid || !key) return { kind: "unauthenticated" };

    return {
      kind: "authenticated",
      authInfo: {
        token: bearerToken,
        clientId: mcpClientId,
        scopes: ["read"],
        extra: { userId: key.referenceId },
      },
    };
  } catch (error) {
    logger.error(`MCP token verification failed: ${error}`);
    return { kind: "unauthenticated" };
  }
}

export function userIdFromAuthInfo(authInfo: AuthInfo | undefined): string {
  const userId = authInfo?.extra?.userId;

  if (typeof userId !== "string" || !userId) {
    throw new Error("This request is not associated with a user.");
  }

  return userId;
}
