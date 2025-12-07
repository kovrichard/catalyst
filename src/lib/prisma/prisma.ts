import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/prisma/generated/client";

// @catalyst:redis-start

import { withRedisCache } from "@/lib/prisma/cache-plugin";

// @catalyst:redis-end

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return (
    new PrismaClient({ adapter })
      // @catalyst:redis-start
      .$extends(
        withRedisCache({
          ttlSeconds: 300,
          shouldCache: ({ result }) =>
            Array.isArray(result) ? result.length > 0 : result !== null,
        })
      )
    // @catalyst:redis-end
  );
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: This is recommended by Prisma
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
