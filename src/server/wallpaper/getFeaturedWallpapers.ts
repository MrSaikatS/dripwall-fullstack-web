"use server";

import prisma from "@/lib/database/dbClient";

export type FeaturedWallpaper = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  downloadCount: number;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

export const getFeaturedWallpapers = async (
  limit: number = 8,
): Promise<FeaturedWallpaper[]> => {
  try {
    const wallpapers = await prisma.wallpaper.findMany({
      where: { isFeatured: true, isPublic: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        downloadCount: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return wallpapers;
  } catch (error) {
    console.error("Get featured wallpapers error:", error);
    return [];
  }
};
