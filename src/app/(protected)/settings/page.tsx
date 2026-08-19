// @catalyst:mcp-start
import { headers } from "next/headers";
// @catalyst:mcp-end
import { Suspense } from "react";
// @catalyst:mcp-start
import { auth } from "@/auth";
// @catalyst:mcp-end
import { PasswordFormSkeleton } from "@/components/auth/password-form-skeleton";
// @catalyst:mcp-start
import ApiKeysCard from "@/components/settings/api-keys-card";
import ApiKeysList from "@/components/settings/api-keys-list";
import ApiKeysSkeleton from "@/components/settings/api-keys-skeleton";
// @catalyst:mcp-end
import DeleteAccountForm from "@/components/settings/delete-account-form";
import PasswordForm from "@/components/settings/password-form";
import { userHasPassword } from "@/lib/dao/users";
import { getUserIdFromSession } from "@/lib/session";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:gap-8 sm:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Change your password, or close your account.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Password</h2>
        <div className="rounded-2xl border bg-card p-4 sm:p-5">
          <Suspense fallback={<PasswordFormSkeleton />}>
            <AccountPasswordForm />
          </Suspense>
        </div>
      </section>

      {/* @catalyst:mcp-start */}
      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">API keys</h2>
        <ApiKeysCard>
          <Suspense fallback={<ApiKeysSkeleton />}>
            <ApiKeys />
          </Suspense>
        </ApiKeysCard>
      </section>
      {/* @catalyst:mcp-end */}

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Your account</h2>
        <DeleteAccountForm />
      </section>
    </div>
  );
}

async function AccountPasswordForm() {
  const userId = await getUserIdFromSession();
  const hasPassword = await userHasPassword(userId);

  return <PasswordForm hasPassword={hasPassword} />;
}

// @catalyst:mcp-start
async function ApiKeys() {
  const { apiKeys } = await auth.api.listApiKeys({ headers: await headers() });

  return <ApiKeysList apiKeys={apiKeys} />;
}
// @catalyst:mcp-end
