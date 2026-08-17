import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = ["first", "second"];

export default function ApiKeysSkeleton() {
  return (
    <ul className="flex flex-col gap-2">
      {PLACEHOLDER_ROWS.map((row) => (
        <li
          key={row}
          className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
        >
          <Skeleton className="size-4 shrink-0 rounded" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-28 max-w-full" />
            <Skeleton className="h-3 w-44 max-w-full" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </li>
      ))}
    </ul>
  );
}
