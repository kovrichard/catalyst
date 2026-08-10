import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

// @catalyst:auth-start

import { TRPCError } from "@trpc/server";
import { getOptionalUser } from "@/lib/session";
// @catalyst:auth-end

export const createTRPCContext = cache(async () => {
  // @catalyst:auth-start
  const user = await getOptionalUser();
  // @catalyst:auth-end
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {
    // @catalyst:auth-start
    user,
    // @catalyst:auth-end
  };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Not exported: a bare `t` is undescriptive and collides with the i18n convention.
const t = initTRPC.context<Context>().create({
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
