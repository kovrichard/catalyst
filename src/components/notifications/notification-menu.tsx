import { Bell } from "lucide-react";
import { cache, Suspense } from "react";
import MarkAllAsReadButton from "@/components/notifications/mark-all-as-read-button";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationListSkeleton } from "@/components/notifications/notification-menu-skeleton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getNotifications } from "@/lib/dao/notifications";
import type { Notification } from "@/lib/prisma/generated/client";
import { getUserIdFromSession } from "@/lib/session";
import { cn } from "@/lib/utils";

// Shared by the count and the list so one request reads the table once.
const notificationsForUser = cache(async () => {
  const userId = await getUserIdFromSession();
  return getNotifications(userId);
});

export default function NotificationMenu() {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative rounded-full"
        )}
      >
        <Bell size={22} />
        <Suspense fallback={null}>
          <UnreadCount />
        </Suspense>
      </PopoverTrigger>
      <PopoverContent className="mr-4 flex w-96 flex-col gap-2 py-2 pr-0 pl-2">
        <p className="pt-2 pl-4 font-semibold text-xl">Notifications</p>
        <Separator className="mr-2 w-auto bg-accent" />
        <Suspense fallback={<NotificationListSkeleton />}>
          <NotificationList />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
}

async function UnreadCount() {
  const notifications = await notificationsForUser();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="absolute -top-0.5 -right-0.5 inline-flex size-4 items-center justify-center p-0 text-[10px]"
    >
      {notifications.length > 9 ? "9+" : notifications.length}
    </Badge>
  );
}

async function NotificationList() {
  const notifications = await notificationsForUser();

  if (notifications.length === 0) {
    return <p className="my-4 text-center text-muted-foreground">No notifications</p>;
  }

  return (
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
  );
}
