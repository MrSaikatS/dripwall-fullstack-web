"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { Prisma } from "@generated/prisma/client";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { PaginatedResponse } from "@/lib/types";
import { headers } from "next/headers";

export type UserLikeItem = Prisma.LikeGetPayload<{
  select: {
    createdAt: true;
    wallpaper: {
      select: {
        id: true;
        title: true;
        thumbnailUrl: true;
        imageUrl: true;
        width: true;
        height: true;
        format: true;
        isFeatured: true;
        downloadCount: true;
        viewCount: true;
        user: { select: { id: true; name: true; image: true } };
        category: { select: { id: true; name: true; slug: true } };
        _count: { select: { likes: true } };
      };
    };
  };
}>;

export const getUserLikes = async (
  page: number = 1,
  pageSize: number = 12,
): Promise<PaginatedResponse<UserLikeItem>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }

  const userId = session.user.id;
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.like.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        createdAt: true,
        wallpaper: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            imageUrl: true,
            width: true,
            height: true,
            format: true,
            isFeatured: true,
            downloadCount: true,
            viewCount: true,
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
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
      },
    }),
    prisma.like.count({ where: { userId } }),
  ]);

  return {
    data: data.map((like) => ({
      ...like,
      wallpaper: {
        ...like.wallpaper,
        imageUrl:
          resolveImageUrl(like.wallpaper.imageUrl) ?? like.wallpaper.imageUrl,
        thumbnailUrl: resolveImageUrl(like.wallpaper.thumbnailUrl),
      },
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
