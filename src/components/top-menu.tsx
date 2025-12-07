import { SidebarTrigger } from "@/components/ui/sidebar";

// @catalyst:auth-start

import NotificationMenu from "./notifications/notification-menu";
// @catalyst:auth-end

export default function TopMenu() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-2">
      <SidebarTrigger />
      {/* @catalyst:auth-start */}
      <NotificationMenu />
      {/* @catalyst:auth-end */}
    </div>
  );
}
