// @catalyst:mcp-start
import { getAuthenticatorName } from "@better-auth/passkey";
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
import PasskeysCard, { type PasskeySummary } from "@/components/settings/passkeys-card";
import PasswordForm from "@/components/settings/password-form";
import { userHasPassword } from "@/lib/dao/users";
import { getUserIdFromSession } from "@/lib/session";
import { toApiKeySummary } from "@/types/api-key";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:gap-8 sm:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Your password, the keys agents use, and your account.
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

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Passkeys</h2>
        <Suspense fallback={<PasswordFormSkeleton />}>
          <AccountPasskeys />
        </Suspense>
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

// The AAGUID names the authenticator model ("1Password", "iCloud Keychain"), which
// beats the device label captured at enrollment. Resolved here so the plugin's
// server-side metadata never reaches the client bundle.
function toPasskeySummary(entry: {
  id: string;
  name?: string | undefined;
  aaguid?: string | undefined;
  createdAt: Date;
}): PasskeySummary {
  return {
    id: entry.id,
    label: getAuthenticatorName(entry.aaguid) ?? entry.name ?? "Passkey",
    createdAt: new Date(entry.createdAt),
  };
}

async function AccountPasskeys() {
  const passkeys = await auth.api.listPasskeys({ headers: await headers() });

  return <PasskeysCard passkeys={passkeys.map(toPasskeySummary)} />;
}

async function AccountPasswordForm() {
  const userId = await getUserIdFromSession();
  const hasPassword = await userHasPassword(userId);

  return <PasswordForm hasPassword={hasPassword} />;
}

// @catalyst:mcp-start
async function ApiKeys() {
  const { apiKeys } = await auth.api.listApiKeys({ headers: await headers() });

  return <ApiKeysList apiKeys={apiKeys.map(toApiKeySummary)} />;
}
// @catalyst:mcp-end
