"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { getSignedUrl } from "@/lib/fileStorage";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type DownloadWallpaperResult = {
  success: boolean;
  data?: {
    signedUrl: string;
    title: string;
  };
  error?: string;
};

export const downloadWallpaper = async (
  wallpaperId: string,
): Promise<DownloadWallpaperResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id: wallpaperId },
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    });

    if (!wallpaper) {
      return { success: false, error: "Wallpaper not found" };
    }

    // Extract S3 key from imageUrl (public URL prefix + key)
    // The key is after the S3_PUBLIC_URL prefix
    const s3PublicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
    const imageKey =
      s3PublicUrl && wallpaper.imageUrl.startsWith(s3PublicUrl) ?
        wallpaper.imageUrl.slice(s3PublicUrl.length + 1)
      : wallpaper.imageUrl;

    // Generate signed URL for secure download
    const signedUrl = await getSignedUrl(imageKey, 3600);

    // Increment download count
    await prisma.wallpaper.update({
      where: { id: wallpaperId },
      data: { downloadCount: { increment: 1 } },
    });

    // Record the download if user is logged in
    if (session?.user?.id) {
      await prisma.download.create({
        data: {
          userId: session.user.id,
          wallpaperId,
        },
      });
    }

    revalidatePath(`/wallpapers/${wallpaperId}`);
    revalidatePath("/wallpapers");

    return {
      success: true,
      data: {
        signedUrl,
        title: wallpaper.title,
      },
    };
  } catch (error) {
    console.error("Download wallpaper error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process download",
    };
  }
};
