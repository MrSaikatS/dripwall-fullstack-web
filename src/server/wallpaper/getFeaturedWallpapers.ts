"use server";

import prisma from "@/lib/database/dbClient";
import { Prisma } from "@generated/prisma/client";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

export type FeaturedWallpaper = Prisma.WallpaperGetPayload<{
  select: {
    id: true;
    title: true;
    thumbnailUrl: true;
    width: true;
    height: true;
    downloadCount: true;
    user: { select: { id: true; name: true; image: true } };
  };
}>;

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

    return wallpapers.map((wp) => ({
      ...wp,
      thumbnailUrl: resolveImageUrl(wp.thumbnailUrl),
    }));
  } catch (error) {
    console.error("Get featured wallpapers error:", error);
    return [];
  }
};
