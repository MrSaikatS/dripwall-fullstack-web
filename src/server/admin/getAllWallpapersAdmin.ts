"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { PaginatedResponse } from "@/lib/types";
import { headers } from "next/headers";

export type AdminWallpaperItem = {
  id: string;
  title: string;
  isFeatured: boolean;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  user: { id: string; name: string };
  category: { id: string; name: string } | null;
  _count: { likes: number };
};

export const getAllWallpapersAdmin = async (
  page: number = 1,
  pageSize: number = 20,
): Promise<PaginatedResponse<AdminWallpaperItem> | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return null;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.wallpaper.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          isFeatured: true,
          isPublic: true,
          downloadCount: true,
          viewCount: true,
          createdAt: true,
          user: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { likes: true } },
        },
      }),
      prisma.wallpaper.count(),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Get all wallpapers admin error:", error);
    return null;
  }
};
