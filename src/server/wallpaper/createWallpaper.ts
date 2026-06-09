"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { generateFileKey, uploadFile } from "@/lib/fileStorage";
import { processImage, validateImageBuffer } from "@/lib/imageProcessor";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";

export type CreateWallpaperResult = {
  success: boolean;
  data?: {
    id: string;
    title: string;
    imageUrl: string;
    thumbnailUrl: string;
  };
  error?: string;
};

export const createWallpaper = async (
  formData: FormData,
): Promise<CreateWallpaperResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to upload" };
    }

    const userId = session.user.id;

    // Extract and validate metadata fields
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") as string | null;

    if (!title || title.trim().length < 3) {
      return { success: false, error: "Title must be at least 3 characters" };
    }

    if (title.length > 128) {
      return { success: false, error: "Title must not exceed 128 characters" };
    }

    if (description && description.length > 500) {
      return {
        success: false,
        error: "Description must not exceed 500 characters",
      };
    }

    // Extract the file from FormData
    const file = formData.get("file") as File | null;

    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Image must be less than 10MB",
      };
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "image/tiff",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF, TIFF",
      };
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate and process image
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

    const processed = await processImage(buffer);

    // Generate unique ID for the file
    const fileUuid = randomUUID();
    const originalExtension = file.name.split(".").pop() || "jpg";
    const safeFileName = `${fileUuid}.${originalExtension}`;

    // Upload original image to S3
    const originalKey = generateFileKey(userId, fileUuid, safeFileName, false);
    const imageUrl = await uploadFile(
      processed.original,
      originalKey,
      file.type,
    );

    // Upload thumbnail to S3
    const thumbnailKey = generateFileKey(userId, fileUuid, safeFileName, true);
    const thumbnailUrl = await uploadFile(
      processed.thumbnail,
      thumbnailKey,
      "image/webp",
    );

    // Create the wallpaper record in the database
    const wallpaper = await prisma.wallpaper.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        imageUrl,
        thumbnailUrl,
        width: processed.metadata.width,
        height: processed.metadata.height,
        fileSize: processed.metadata.fileSize,
        format: processed.metadata.format,
        userId,
        categoryId: categoryId || undefined,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        thumbnailUrl: true,
      },
    });

    revalidatePath("/wallpapers");
    revalidatePath("/");

    return {
      success: true,
      data: {
        id: wallpaper.id,
        title: wallpaper.title,
        imageUrl: wallpaper.imageUrl,
        thumbnailUrl: wallpaper.thumbnailUrl ?? "",
      },
    };
  } catch (error) {
    console.error("Create wallpaper error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload wallpaper",
    };
  }
};
