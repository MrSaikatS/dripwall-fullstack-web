"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { deleteFile } from "@/lib/fileStorage";
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
    const s3PublicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
    if (s3PublicUrl) {
      const imageKey = wallpaper.imageUrl.startsWith(s3PublicUrl)
        ? wallpaper.imageUrl.slice(s3PublicUrl.length + 1)
        : wallpaper.imageUrl;
      await deleteFile(imageKey).catch(() => {});

      if (wallpaper.thumbnailUrl) {
        const thumbKey = wallpaper.thumbnailUrl.startsWith(s3PublicUrl)
          ? wallpaper.thumbnailUrl.slice(s3PublicUrl.length + 1)
          : wallpaper.thumbnailUrl;
        await deleteFile(thumbKey).catch(() => {});
      }
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
      error:
        error instanceof Error ? error.message : "Failed to delete wallpaper",
    };
  }
};
