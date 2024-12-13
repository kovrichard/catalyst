"use client";

import { readNotification } from "@/lib/actions/notifications";
import { formatTimeAgo } from "@/lib/utils";
import { Notification } from "@prisma/client";
import { IconDots } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
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
        className="flex gap-2 p-2 items-start rounded hover:bg-accent transition-colors duration-200"
        onClick={() => readNotification(notification.id)}
      >
        <span className="relative inline-flex shrink-0 rounded-full size-2 bg-green-500 mt-2"></span>
        <div className="flex flex-col gap-1">
          <p>{notification.title}</p>
          <p className="text-sm text-muted-foreground text-pretty">
            {notification.content}
          </p>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hover:bg-muted/50 shrink-0 rounded-full"
          onClick={handleNotificationClick}
        >
          <IconDots size={20} />
        </Button>
      </Link>
    </li>
  );
}
