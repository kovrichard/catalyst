import { Skeleton } from "@/components/ui/skeleton";

export function NotificationListSkeleton() {
  return (
    <div className="flex flex-col gap-2 pr-2 pl-2">
      {["first", "second", "third"].map((row) => (
        <Skeleton className="h-16 w-full rounded-md" key={row} />
      ))}
    </div>
  );
}
