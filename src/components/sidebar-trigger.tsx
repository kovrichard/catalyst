"use client";

import { cn } from "@/lib/utils";
import { IconLayoutSidebar } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

export function CustomSidebarTrigger({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button className={cn(className)} variant="ghost" size="icon" onClick={toggleSidebar}>
      <IconLayoutSidebar size={20} stroke={2} />
    </Button>
  );
}
