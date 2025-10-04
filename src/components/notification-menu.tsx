import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getNotifications } from "@/lib/dao/notifications";
import { Notification } from "@prisma/client";
import { Bell } from "lucide-react";
import MarkAllAsReadButton from "./mark-all-as-read-button";
import { NotificationItem } from "./notification-item";

export default async function NotificationMenu() {
  const notifications = await getNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell size={22} />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute inline-flex items-center justify-center p-0 size-4 -top-0.5 -right-0.5 text-[10px]"
            >
              {notifications.length > 9 ? "9+" : notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 mr-4 py-2 pl-2 pr-0 w-96">
        <p className="pt-2 pl-4 text-xl font-semibold">Notifications</p>
        <Separator className="bg-accent mr-2 w-auto" />
        {notifications.length > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <ScrollArea className="h-96 pr-2">
              <ul className="space-y-2">
                {notifications.map((notification: Notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </ul>
            </ScrollArea>
            <Separator className="bg-accent mr-2" />
            <div className="flex w-full justify-start">
              <MarkAllAsReadButton notifications={notifications} />
            </div>
          </div>
        ) : (
          <p className="text-center my-4 text-muted-foreground">No notifications</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
