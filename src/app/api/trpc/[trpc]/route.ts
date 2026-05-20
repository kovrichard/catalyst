import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// @catalyst:auth-start
import { createTRPCContext } from "@/lib/trpc/init";
// @catalyst:auth-end
import { appRouter } from "@/lib/trpc/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    // @catalyst:auth-start
    createContext: createTRPCContext,
    // @catalyst:auth-end
  });

export { handler as GET, handler as POST };
