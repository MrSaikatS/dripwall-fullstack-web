"use server";

import prisma from "@/lib/database/dbClient";
import { Prisma } from "@generated/prisma/client";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

export type WallpaperDetailData = Prisma.WallpaperGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    imageUrl: true;
    thumbnailUrl: true;
    width: true;
    height: true;
    fileSize: true;
    format: true;
    isFeatured: true;
    downloadCount: true;
    viewCount: true;
    createdAt: true;
    updatedAt: true;
    user: { select: { id: true; name: true; image: true } };
    category: { select: { id: true; name: true; slug: true } };
    tags: { select: { tag: { select: { id: true; name: true } } } };
    _count: { select: { likes: true } };
  };
}>;

export const getWallpaperById = async (
  id: string,
): Promise<WallpaperDetailData | null> => {
  try {
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        fileSize: true,
        format: true,
        isFeatured: true,
        downloadCount: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!wallpaper) {
      return null;
    }

    return {
      ...wallpaper,
      imageUrl: resolveImageUrl(wallpaper.imageUrl) ?? wallpaper.imageUrl,
      thumbnailUrl: resolveImageUrl(wallpaper.thumbnailUrl),
    };
  } catch (error) {
    console.error("Get wallpaper by ID error:", error);
    return null;
  }
};
