import { Skeleton } from "@/components/ui/skeleton";

const FIELD_ROWS = ["new-password", "confirm-password"];

export function PasswordFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {FIELD_ROWS.map((row) => (
        <div key={row} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-9 w-16 rounded-md" />
    </div>
  );
}
