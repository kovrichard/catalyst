import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:gap-8 sm:p-10">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:p-5">
        <h1 className="font-semibold text-2xl tracking-tight">This page is not here</h1>
        <p className="text-muted-foreground text-sm">
          It may have been deleted, or the link may be out of date. Nothing is broken.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild>
            <Link href="/dashboard">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
