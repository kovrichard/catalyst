import DeleteAccountForm from "@/components/settings/delete-account-form";
import PasswordForm from "@/components/settings/password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserIdFromSession } from "@/lib/dao/users";
import prisma from "@/lib/prisma/prisma";

export default async function SettingsPage() {
  const userId = await getUserIdFromSession();
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });
  const hasPassword = Boolean(user?.password);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-w-[320px] max-h-svh bg-background md:rounded-[20px]">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <PasswordForm hasPassword={hasPassword} />
            <DeleteAccountForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
