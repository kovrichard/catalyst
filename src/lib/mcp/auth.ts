import type { AuthInfo } from "@modelcontextprotocol/server";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";

const mcpClientId = "catalyst-mcp";

/**
 * Resolves a bearer token to the user it acts for. Today the only branch is a
 * Better Auth API key; an OAuth access token becomes a second branch here,
 * leaving the tool and DAO layers untouched.
 */
export async function resolveMcpToken(
  _request: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> {
  if (!bearerToken) return undefined;

  try {
    const { valid, key } = await auth.api.verifyApiKey({ body: { key: bearerToken } });

    if (!valid || !key) return undefined;

    return {
      token: bearerToken,
      clientId: mcpClientId,
      scopes: ["read"],
      extra: { userId: key.referenceId },
    };
  } catch (error) {
    logger.error(`MCP token verification failed: ${error}`);
    return undefined;
  }
}

export function userIdFromAuthInfo(authInfo: AuthInfo | undefined): string {
  const userId = authInfo?.extra?.userId;

  if (typeof userId !== "string" || !userId) {
    throw new Error("This request is not associated with a user.");
  }

  return userId;
}
