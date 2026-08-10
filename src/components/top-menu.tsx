import { SidebarTrigger } from "@/components/ui/sidebar";

// @catalyst:auth-start

import { Suspense } from "react";
import NotificationMenu from "./notifications/notification-menu";
import { NotificationMenuSkeleton } from "./notifications/notification-menu-skeleton";
// @catalyst:auth-end

export default function TopMenu() {
  return (
    <div className="flex items-center justify-between border-b bg-sidebar px-4 py-2">
      <SidebarTrigger />
      {/* @catalyst:auth-start */}
      <Suspense fallback={<NotificationMenuSkeleton />}>
        <NotificationMenu />
      </Suspense>
      {/* @catalyst:auth-end */}
    </div>
  );
}
