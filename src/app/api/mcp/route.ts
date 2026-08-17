import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { authenticateMcpRequest, type McpAuthOutcome } from "@/lib/mcp/auth";
import { registerMcpTools } from "@/lib/mcp/tools";

const mcpHandler = createMcpHandler(registerMcpTools, {
  serverInfo: { name: "catalyst", version: "1.0.0" },
});

const serverErrorJsonRpcCode = -32000;

function tooManyRequestsResponse(retryAfterSeconds: number, message: string): Response {
  return Response.json(
    {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: serverErrorJsonRpcCode,
        message: `${message} Retry in ${retryAfterSeconds}s.`,
        data: { retryAfterSeconds },
      },
    },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}

function servedWith(outcome: McpAuthOutcome) {
  const authInfo = outcome.kind === "authenticated" ? outcome.authInfo : undefined;

  return withMcpAuth(mcpHandler, () => Promise.resolve(authInfo), { required: true });
}

async function handler(request: Request): Promise<Response> {
  const outcome = await authenticateMcpRequest(request);

  if (outcome.kind === "rate-limited") {
    return tooManyRequestsResponse(outcome.retryAfterSeconds, outcome.message);
  }

  return servedWith(outcome)(request);
}

export { handler as GET, handler as POST, handler as DELETE };
