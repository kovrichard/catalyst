import { Skeleton } from "@/components/ui/skeleton";

// Mirrors AuthProviders: buttons at the Button default height, then the divider.
export function AuthProvidersSkeleton({ actions }: Readonly<{ actions: number }>) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {Array.from({ length: actions }, (_, index) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder list with no identity
            key={index}
            className="h-11 w-full rounded-md md:h-10"
          />
        ))}
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
