import DeleteAccountForm from "@/components/settings/delete-account-form";
import PasswordForm from "@/components/settings/password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma/prisma";
import { getUserIdFromSession } from "@/lib/services/user.service";

/**
 * Render the Settings page with account management controls.
 *
 * Retrieves the current user session to determine whether the user has a password,
 * and renders a settings card containing a PasswordForm (passed `hasPassword`)
 * and a DeleteAccountForm.
 *
 * @returns A JSX element containing the settings UI; `PasswordForm` receives `hasPassword` indicating whether the current user has a password.
 */
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
    <div className="relative flex max-h-svh min-w-[320px] flex-1 flex-col items-center justify-center bg-background md:rounded-[20px]">
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