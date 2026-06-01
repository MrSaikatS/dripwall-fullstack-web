"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { PaginatedResponse } from "@/lib/types";
import { headers } from "next/headers";

export type UserDownloadItem = {
  id: string;
  downloadedAt: Date;
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

export const getUserDownloads = async (
  page: number = 1,
  pageSize: number = 12,
): Promise<PaginatedResponse<UserDownloadItem>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }

  const userId = session.user.id;
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.download.findMany({
      where: { userId },
      orderBy: { downloadedAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        downloadedAt: true,
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
    prisma.download.count({ where: { userId } }),
  ]);

  return {
    data: data.map((download) => ({
      ...download,
      wallpaper: {
        ...download.wallpaper,
        imageUrl: resolveImageUrl(download.wallpaper.imageUrl) ?? download.wallpaper.imageUrl,
        thumbnailUrl: resolveImageUrl(download.wallpaper.thumbnailUrl),
      },
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
