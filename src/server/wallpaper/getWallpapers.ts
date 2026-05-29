"use server";

import prisma from "@/lib/database/dbClient";
import type { PaginatedResponse } from "@/lib/types";

export type WallpaperListItem = {
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

export type GetWallpapersParams = {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  tagId?: string;
  search?: string;
  sortBy?: "newest" | "popular" | "downloads";
  isFeatured?: boolean;
};

export const getWallpapers = async (
  params: GetWallpapersParams = {},
): Promise<PaginatedResponse<WallpaperListItem>> => {
  const {
    page = 1,
    pageSize = 12,
    categoryId,
    tagId,
    search,
    sortBy = "newest",
    isFeatured,
  } = params;

  const skip = (page - 1) * pageSize;

  // Build where clause
  const where: Record<string, unknown> = { isPublic: true };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (tagId) {
    where.tags = { some: { tagId } };
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  // Build orderBy
  let orderBy: Record<string, string>;
  switch (sortBy) {
    case "popular":
      orderBy = { viewCount: "desc" };
      break;
    case "downloads":
      orderBy = { downloadCount: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const [data, total] = await Promise.all([
    prisma.wallpaper.findMany({
      where,
      orderBy,
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
    }),
    prisma.wallpaper.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
