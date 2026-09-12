import prisma from "@/lib/prisma/prisma";

export async function pingDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}
