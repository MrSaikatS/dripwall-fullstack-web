"use server";

import prisma from "@/lib/database/dbClient";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

export type WallpaperDetailData = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  format: string | null;
  isFeatured: boolean;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: { tag: { id: string; name: string } }[];
  _count: {
    likes: number;
  };
};

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
