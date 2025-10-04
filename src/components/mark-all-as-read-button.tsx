"use client";

import type { Notification } from "@prisma/client";
import { readNotifications } from "@/lib/actions/notifications";
import { Button } from "./ui/button";

export default function MarkAllAsReadButton({
  notifications,
}: Readonly<{ notifications: Notification[] }>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-sm text-muted-foreground"
      onClick={() => readNotifications(notifications.map((n: Notification) => n.id))}
    >
      Mark all as read
    </Button>
  );
}
