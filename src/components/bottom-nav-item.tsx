"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BottomNavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: ReactNode;
};

function BottomNavItemView({
  href,
  icon,
  label,
  badge,
  active,
}: BottomNavItemProps & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative flex h-full w-16 flex-col items-center justify-center gap-1 rounded-none p-1",
        active && "text-primary [&_svg]:stroke-[2.5]"
      )}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute top-0 h-0.5 w-10 rounded-full bg-primary"
        />
      ) : null}
      <span className="relative">
        {icon}
        {badge}
      </span>
      <span
        className={cn(
          "text-xs",
          active ? "font-semibold text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function ActiveBottomNavItem(props: BottomNavItemProps) {
  const pathname = usePathname();
  const active = pathname === props.href || pathname.startsWith(`${props.href}/`);

  return <BottomNavItemView {...props} active={active} />;
}

export function BottomNavItem(props: BottomNavItemProps) {
  return (
    <Suspense fallback={<BottomNavItemView {...props} active={false} />}>
      <ActiveBottomNavItem {...props} />
    </Suspense>
  );
}
