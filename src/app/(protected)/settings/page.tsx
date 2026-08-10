import { Suspense } from "react";
import { PasswordFormSkeleton } from "@/components/auth/password-form-skeleton";
import DeleteAccountForm from "@/components/settings/delete-account-form";
import PasswordForm from "@/components/settings/password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userHasPassword } from "@/lib/dao/users";
import { getUserIdFromSession } from "@/lib/session";

export default function SettingsPage() {
  return (
    <div className="relative flex max-h-svh min-w-[320px] flex-1 flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Suspense fallback={<PasswordFormSkeleton />}>
              <AccountPasswordForm />
            </Suspense>
            <DeleteAccountForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function AccountPasswordForm() {
  const userId = await getUserIdFromSession();
  const hasPassword = await userHasPassword(userId);

  return <PasswordForm hasPassword={hasPassword} />;
}
