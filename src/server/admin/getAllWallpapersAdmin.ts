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
  sortField?: string,
  sortOrder?: string,
): Promise<PaginatedResponse<AdminWallpaperItem> | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return null;
    }

    const skip = (page - 1) * pageSize;

    const orderBy = (() => {
      const d = sortOrder === "asc" ? "asc" : "desc";
      if (!sortField) return { createdAt: "desc" } as const;
      if (sortField === "title") return { title: d } as const;
      if (sortField === "downloadCount") return { downloadCount: d } as const;
      if (sortField === "likes") return { likes: { _count: d } } as const;
      return { createdAt: "desc" } as const;
    })();

    const [data, total] = await Promise.all([
      prisma.wallpaper.findMany({
        orderBy,
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

    const totalPages = Math.ceil(total / pageSize);
    let currentPage = page;

    if (totalPages > 0 && currentPage > totalPages) {
      currentPage = totalPages;
      const clampedSkip = (currentPage - 1) * pageSize;
      const [clampedData] = await Promise.all([
        prisma.wallpaper.findMany({
          orderBy,
          skip: clampedSkip,
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
      ]);
      return {
        data: clampedData,
        total,
        page: currentPage,
        pageSize,
        totalPages,
      };
    }

    return {
      data,
      total,
      page: currentPage,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Get all wallpapers admin error:", error);
    return null;
  }
};
