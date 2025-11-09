"use client";

import { readNotifications } from "@/lib/actions/notifications";
import type { Notification } from "@/lib/prisma/client";
import { Button } from "./ui/button";

export default function MarkAllAsReadButton({
  notifications,
}: Readonly<{ notifications: Notification[] }>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground text-sm"
      onClick={() => readNotifications(notifications.map((n: Notification) => n.id))}
    >
      Mark all as read
    </Button>
  );
}
