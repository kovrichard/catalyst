import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationMenu from "./notification-menu";

/**
 * Renders the top application menu containing the sidebar trigger and notification menu.
 *
 * @returns A JSX element for the top menu bar that contains `SidebarTrigger` on the left and `NotificationMenu` on the right.
 */
export default function TopMenu() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-2">
      <SidebarTrigger />
      <NotificationMenu />
    </div>
  );
}