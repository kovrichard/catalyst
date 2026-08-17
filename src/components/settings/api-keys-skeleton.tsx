import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = ["first", "second"];

export default function ApiKeysSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      <ul className="flex flex-col gap-2">
        {PLACEHOLDER_ROWS.map((row) => (
          <li
            key={row}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-32 max-w-full" />
              <Skeleton className="h-3 w-40 max-w-full" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}
