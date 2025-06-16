"use server";

import { authOptions } from "@/app/api/auth/options"
import { getServerSession } from "next-auth"
import { UserNotifications } from "./types";
import { revalidateTag } from "next/cache";

export const getAllNotifications = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/notifications/${session.user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      },
      next: {
        tags: ["notifications"],
        revalidate: 60
      }
    })

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || "Failed to fetch notifications" };
    }

    const data = await res.json() as UserNotifications;
    return { success: true, data: data };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: "Failed to fetch notifications" };
  }
}

export const toggleNotificationReadStatus = async (notificationId: number) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/notifications/${notificationId}/toggle-read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || "Failed to toggle notification read status" };
    }

    revalidateTag("notifications");
    return { success: true, message: "Notification read status toggled successfully" };
  } catch (error) {
    console.error("Error toggling notification read status:", error);
    return { success: false, message: "Failed to toggle notification read status" };
  }
}

export const deleteNotification = async (notificationId: number) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || "Failed to delete notification" };
    }

    revalidateTag("notifications");
    return { success: true, message: "Notification deleted successfully" };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, message: "Failed to delete notification" };
  }
}

export const markAllNotificationsAsRead = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/notifications/${session.user.id}/mark-all-read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || "Failed to mark all notifications as read" };
    }

    revalidateTag("/notifications");
    return { success: true, message: "All notifications marked as read successfully" };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, message: "Failed to mark all notifications as read" };
  }
}