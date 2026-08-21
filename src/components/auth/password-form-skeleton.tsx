import { Skeleton } from "@/components/ui/skeleton";

const RESET_FIELDS = ["new-password", "confirm-password"];
const ACCOUNT_FIELDS = ["current-password", "new-password", "confirm-password"];

function FieldRowSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="h-11 w-full rounded-md md:h-9" />
    </div>
  );
}

export function PasswordResetFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {RESET_FIELDS.map((field) => (
        <FieldRowSkeleton key={field} />
      ))}
      <Skeleton className="h-11 w-full rounded-md md:h-9" />
    </div>
  );
}

export function PasswordFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {ACCOUNT_FIELDS.map((field) => (
        <FieldRowSkeleton key={field} />
      ))}
      <Skeleton className="h-11 w-32 rounded-md md:h-9" />
    </div>
  );
}
