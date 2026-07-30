import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// @catalyst:auth-start

import { TRPCError } from "@trpc/server";
import { cache } from "react";
import { getUserFromSession } from "@/lib/session";

export const createTRPCContext = cache(async () => {
  const user = await getUserFromSession();
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { user };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// @catalyst:auth-end

// Not exported: a bare `t` is undescriptive and collides with the i18n convention.
const t = initTRPC
  // @catalyst:auth-start
  .context<Context>()
  // @catalyst:auth-end
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
  });

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
// @catalyst:auth-start
export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});
// @catalyst:auth-end
