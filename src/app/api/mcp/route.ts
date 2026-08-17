import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { resolveMcpToken } from "@/lib/mcp/auth";
import { registerMcpTools } from "@/lib/mcp/tools";

const mcpHandler = createMcpHandler(registerMcpTools, {
  serverInfo: { name: "catalyst", version: "1.0.0" },
});

const handler = withMcpAuth(mcpHandler, resolveMcpToken, { required: true });

export { handler as GET, handler as POST, handler as DELETE };
