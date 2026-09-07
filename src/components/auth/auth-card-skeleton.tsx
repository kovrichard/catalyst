import { Skeleton } from "@/components/ui/skeleton";

const LOGIN_FIELDS = ["email", "password"];
const LOGIN_ACTIONS = ["sign-in", "passkey"];
const REGISTER_FIELDS = ["name", "email", "password"];
const REGISTER_ACTIONS = ["sign-up"];

function FieldRowSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-11 w-full rounded-md md:h-9" />
    </div>
  );
}

function AuthCardSkeleton({
  fields,
  actions,
}: Readonly<{ fields: string[]; actions: string[] }>) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 rounded-2xl border bg-card p-6">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="flex flex-col gap-6">
        {fields.map((field) => (
          <FieldRowSkeleton key={field} />
        ))}
        {actions.map((action) => (
          <Skeleton key={action} className="h-11 w-full rounded-md md:h-9" />
        ))}
      </div>

      <Skeleton className="mx-auto h-4 w-36" />
    </div>
  );
}

export function LoginCardSkeleton() {
  return <AuthCardSkeleton fields={LOGIN_FIELDS} actions={LOGIN_ACTIONS} />;
}

export function RegisterCardSkeleton() {
  return <AuthCardSkeleton fields={REGISTER_FIELDS} actions={REGISTER_ACTIONS} />;
}
