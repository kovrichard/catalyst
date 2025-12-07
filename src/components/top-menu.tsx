import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationMenu from "./notifications/notification-menu";

export default function TopMenu() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-2">
      <SidebarTrigger />
      <NotificationMenu />
    </div>
  );
}
