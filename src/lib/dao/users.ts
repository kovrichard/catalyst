import prisma from "@/lib/prisma/prisma";

export async function userHasPassword(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      accounts: {
        select: {
          password: true,
        },
      },
    },
  });

  return user?.accounts?.some((account) => account.password) ?? false;
}

export async function deleteUserById(userId: string): Promise<void> {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
