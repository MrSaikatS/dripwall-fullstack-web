"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { PaginatedResponse } from "@/lib/types";
import { headers } from "next/headers";

export type UserLikeItem = {
  createdAt: Date;
  wallpaper: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    imageUrl: string;
    width: number | null;
    height: number | null;
    format: string | null;
    isFeatured: boolean;
    downloadCount: number;
    viewCount: number;
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
    _count: {
      likes: number;
    };
  };
};

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
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
