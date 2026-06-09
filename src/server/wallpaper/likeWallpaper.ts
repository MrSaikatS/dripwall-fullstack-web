"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type LikeWallpaperResult = {
  success: boolean;
  data?: {
    liked: boolean;
    likesCount: number;
  };
  error?: string;
  code?: string;
};

export const likeWallpaper = async (
  wallpaperId: string,
): Promise<LikeWallpaperResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to like wallpapers",
        code: "UNAUTHORIZED",
      };
    }

    const userId = session.user.id;

    // Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_wallpaperId: { userId, wallpaperId },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_wallpaperId: { userId, wallpaperId },
        },
      });

      const likesCount = await prisma.like.count({
        where: { wallpaperId },
      });

      revalidatePath(`/wallpapers/${wallpaperId}`);
      revalidatePath("/wallpapers");

      return { success: true, data: { liked: false, likesCount } };
    }

    // Like
    await prisma.like.create({
      data: { userId, wallpaperId },
    });

    const likesCount = await prisma.like.count({
      where: { wallpaperId },
    });

    revalidatePath(`/wallpapers/${wallpaperId}`);
    revalidatePath("/wallpapers");

    return { success: true, data: { liked: true, likesCount } };
  } catch (error) {
    console.error("Like wallpaper error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
};
