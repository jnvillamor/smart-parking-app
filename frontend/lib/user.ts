"use server";

import { z } from "zod";
import { UpdateProfileSchema } from "./schema";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";

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