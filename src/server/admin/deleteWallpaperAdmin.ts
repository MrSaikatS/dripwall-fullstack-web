"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { deleteFile } from "@/lib/fileStorage";
import { extractS3Key } from "@/lib/resolveImageUrl";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type DeleteWallpaperAdminResult = {
  success: boolean;
  error?: string;
};

export const deleteWallpaperAdmin = async (
  wallpaperId: string,
): Promise<DeleteWallpaperAdminResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return { success: false, error: "Not authorized" };
    }

    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id: wallpaperId },
      select: { id: true, imageUrl: true, thumbnailUrl: true },
    });

    if (!wallpaper) {
      return { success: false, error: "Wallpaper not found" };
    }

    // Delete S3 files
    const imageKey = extractS3Key(wallpaper.imageUrl);
    await deleteFile(imageKey).catch(() => {});

    if (wallpaper.thumbnailUrl) {
      const thumbKey = extractS3Key(wallpaper.thumbnailUrl);
      await deleteFile(thumbKey).catch(() => {});
    }

    await prisma.wallpaper.delete({ where: { id: wallpaperId } });

    revalidatePath("/admin/wallpapers");
    revalidatePath("/wallpapers");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete wallpaper admin error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
