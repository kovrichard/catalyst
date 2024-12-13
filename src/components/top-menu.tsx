import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationMenu from "./notification-menu";

export default function TopMenu() {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-sidebar">
      <SidebarTrigger />
      <NotificationMenu />
    </div>
  );
}
