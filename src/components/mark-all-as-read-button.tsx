"use client";

import type { Notification } from "@prisma/client";
import { readNotifications } from "@/lib/actions/notifications";
import { Button } from "./ui/button";

/**
 * Renders a button that marks the given notifications as read when clicked.
 *
 * @param notifications - Array of notifications to mark as read
 * @returns The button element that, when clicked, marks the provided notifications as read
 */
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