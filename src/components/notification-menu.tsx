import type { Notification } from "@prisma/client";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getUserNotifications } from "@/lib/services/notification.service";
import MarkAllAsReadButton from "./mark-all-as-read-button";
import { NotificationItem } from "./notification-item";

/**
 * Renders a popover notification menu showing the user's notifications, a numeric badge, and related actions.
 *
 * The popover trigger displays a bell icon with a badge when there is at least one notification (count capped at "9+"). The popover content shows a header, a scrollable list of notification items with a "mark all as read" action when notifications exist, or a centered "No notifications" message when none are present.
 *
 * @returns A React element representing the notification popover UI
 */
export default async function NotificationMenu() {
  const notifications = await getUserNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell size={22} />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="-top-0.5 -right-0.5 absolute inline-flex size-4 items-center justify-center p-0 text-[10px]"
            >
              {notifications.length > 9 ? "9+" : notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-4 flex w-96 flex-col gap-2 py-2 pr-0 pl-2">
        <p className="pt-2 pl-4 font-semibold text-xl">Notifications</p>
        <Separator className="mr-2 w-auto bg-accent" />
        {notifications.length > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <ScrollArea className="h-96 pr-2">
              <ul className="space-y-2">
                {notifications.map((notification: Notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </ul>
            </ScrollArea>
            <Separator className="mr-2 bg-accent" />
            <div className="flex w-full justify-start">
              <MarkAllAsReadButton notifications={notifications} />
            </div>
          </div>
        ) : (
          <p className="my-4 text-center text-muted-foreground">No notifications</p>
        )}
      </PopoverContent>
    </Popover>
  );
}