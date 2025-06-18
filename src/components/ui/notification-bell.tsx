import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fake notifications data
  const fakeNotifications: Notification[] = [
    {
      id: 1,
      title: "New Order",
      message: "You have a new order",
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      title: "Task Update",
      message: "Your task has been updated",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 3,
      title: "System Update",
      message: "The system has been updated to the new version",
      time: "2 hours ago",
      isRead: true,
    },
    {
      id: 4,
      title: "New Task",
      message: "You have a new task",
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: 5,
      title: "Project Task",
      message: "You have a new project task",
      time: "2 minutes ago",
      isRead: false,
    },
  ];

  // Notification sound
  const notificationSound = new Audio("/notification.mp3");

  useEffect(() => {
    setNotifications(fakeNotifications);
    setUnreadCount(fakeNotifications.filter((n) => !n.isRead).length);
  }, []);

  const playNotificationSound = () => {
    if (!isPlaying) {
      notificationSound.play();
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={playNotificationSound}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[350px] overflow-y-auto dark:bg-gray-800 dark:text-white"
      >
        <div className="flex items-center justify-between p-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="p-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 rounded-lg cursor-pointer hover:bg-accent ${
                  !notification.isRead ? "bg-accent/50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
