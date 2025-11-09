"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { readNotification } from "@/lib/actions/notifications";
import type { Notification } from "@/lib/prisma/client";
import { formatTimeAgo } from "@/lib/utils";
import { Button } from "./ui/button";

export function NotificationItem({
  notification,
}: Readonly<{ notification: Notification }>) {
  function handleNotificationClick(event: React.MouseEvent) {
    event.preventDefault();
  }

  return (
    <li>
      <Link
        href={notification.link || "#"}
        className="flex items-start gap-2 rounded p-2 transition-colors duration-200 hover:bg-accent"
        onClick={() => readNotification(notification.id)}
      >
        <span className="relative mt-2 inline-flex size-2 shrink-0 rounded-full bg-green-500"></span>
        <div className="flex flex-col gap-1">
          <p>{notification.title}</p>
          <p className="text-pretty text-muted-foreground text-sm">
            {notification.content}
          </p>
          <span className="text-muted-foreground text-xs">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0 rounded-full hover:bg-muted/50"
          onClick={handleNotificationClick}
        >
          <Ellipsis size={20} />
        </Button>
      </Link>
    </li>
  );
}
