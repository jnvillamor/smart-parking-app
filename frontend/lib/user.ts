"use server";

import { z } from "zod";
import { UpdatePasswordSchema, UpdateProfileSchema } from "./schema";
import { getServerSession, Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const updateUserProfile = async (data: z.infer<typeof UpdateProfileSchema>, session: Session) => {
  try {
    const body = JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email
    });
    
    const res = await fetch(`${process.env.API_BASE_URL}/users/${session.user.id}`, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Profile update failed:", errorData);
      return {
        success: false,
        message: errorData.detail || "Failed to update profile. Please try again."
      };
    }

    revalidatePath("/profile");
    return {
      success: true,
      message: "Profile updated successfully!"
    }
  }
  catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: "Failed to update profile. Please try again later."
    };
  }
}

export const updateUserPassword = async (data: z.infer<typeof UpdatePasswordSchema>) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: "You must be logged in to update your password."
    };
  }

  const body = JSON.stringify({
    old_password: data.currentPassword,
    new_password: data.newPassword,
  })

  try { 
    const res = await fetch(`${process.env.API_BASE_URL}/users/change-password/${session.user.id}`, { 
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    if(!res.ok) {
      const errorData = await res.json();
      console.error("Password update failed:", errorData);
      return {
        success: false,
        message: errorData.detail || "Failed to update password. Please try again."
      };
    }

    revalidatePath("/profile");
    return {
      success: true,
      message: "Password updated successfully!"
    };
  }
  catch (error) { 
    console.error("Error updating user password:", error);
    return {
      success: false,
      message: "Failed to update password. Please try again later."
    };
  }
}