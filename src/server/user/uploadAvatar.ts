"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { deleteFile, uploadFile } from "@/lib/fileStorage";
import { validateImageBuffer } from "@/lib/imageProcessor";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";

export type UploadAvatarResult = {
  success: boolean;
  error?: string;
};

export const uploadAvatar = async (
  formData: FormData,
): Promise<UploadAvatarResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    const userId = session.user.id;

    const file = formData.get("avatar") as File | null;

    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Image must be less than 5MB",
      };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      validateImageBuffer(buffer);
    } catch (validationError) {
      return {
        success: false,
        error:
          validationError instanceof Error ?
            validationError.message
          : "Invalid image file",
      };
    }

    const fileUuid = randomUUID();
    const originalExtension = file.name.split(".").pop() || "jpg";
    const safeFileName = `${fileUuid}.${originalExtension}`;

    const key = `avatars/${userId}/${safeFileName}`;
    const url = await uploadFile(buffer, key, file.type);

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { image: url },
      });
    } catch (dbError) {
      console.error("Failed to update user avatar in DB, cleaning up uploaded file:", dbError);
      try {
        await deleteFile(key);
      } catch (deleteError) {
        console.error("Failed to delete orphaned avatar file:", deleteError);
      }
      return { success: false, error: "Failed to save avatar. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("Upload avatar error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload avatar",
    };
  }
};
