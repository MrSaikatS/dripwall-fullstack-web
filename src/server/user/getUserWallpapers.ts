"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { PaginatedResponse } from "@/lib/types";
import { headers } from "next/headers";

export type UserWallpaperItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  imageUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  isFeatured: boolean;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    likes: number;
  };
};

export const getUserWallpapers = async (
  page: number = 1,
  pageSize: number = 12,
): Promise<PaginatedResponse<UserWallpaperItem>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }

  const userId = session.user.id;
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.wallpaper.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        imageUrl: true,
        width: true,
        height: true,
        format: true,
        isFeatured: true,
        downloadCount: true,
        viewCount: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.wallpaper.count({ where: { userId } }),
  ]);

  return {
    data: data.map((wp) => ({
      ...wp,
      imageUrl: resolveImageUrl(wp.imageUrl) ?? wp.imageUrl,
      thumbnailUrl: resolveImageUrl(wp.thumbnailUrl),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
