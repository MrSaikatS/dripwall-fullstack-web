"use server";

import prisma from "@/lib/database/dbClient";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { PaginatedResponse } from "@/lib/types";
import type { WallpaperListItem } from "@/server/wallpaper/getWallpapers";

export type CategoryDetailData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type CategoryWallpaperItem = WallpaperListItem;

export type GetCategoryBySlugResult = {
  category: CategoryDetailData | null;
  wallpapers: PaginatedResponse<CategoryWallpaperItem>;
};

export const getCategoryBySlug = async (
  slug: string,
  page: number = 1,
  pageSize: number = 12,
): Promise<GetCategoryBySlugResult> => {
  const skip = (page - 1) * pageSize;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
    },
  });

  if (!category) {
    return {
      category: null,
      wallpapers: {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      },
    };
  }

  const where = { categoryId: category.id, isPublic: true };

  const [data, total] = await Promise.all([
    prisma.wallpaper.findMany({
      where,
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
    category,
    wallpapers: {
      data: data.map((wp) => ({
        ...wp,
        imageUrl: resolveImageUrl(wp.imageUrl) ?? wp.imageUrl,
        thumbnailUrl: resolveImageUrl(wp.thumbnailUrl),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
