"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type AdminStats = {
  totalUsers: number;
  totalWallpapers: number;
  totalCategories: number;
  totalDownloads: number;
};

export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return null;
    }

    const [totalUsers, totalWallpapers, totalCategories, totalDownloads] =
      await Promise.all([
        prisma.user.count(),
        prisma.wallpaper.count(),
        prisma.category.count(),
        prisma.download.count(),
      ]);

    return { totalUsers, totalWallpapers, totalCategories, totalDownloads };
  } catch (error) {
    console.error("Get admin stats error:", error);
    return null;
  }
};
