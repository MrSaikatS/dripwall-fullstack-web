"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type ToggleFeaturedResult = {
  success: boolean;
  data?: { isFeatured: boolean };
  error?: string;
};

export const toggleFeatured = async (
  wallpaperId: string,
): Promise<ToggleFeaturedResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return { success: false, error: "Not authorized" };
    }

    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id: wallpaperId },
      select: { id: true, isFeatured: true },
    });

    if (!wallpaper) {
      return { success: false, error: "Wallpaper not found" };
    }

    const updated = await prisma.wallpaper.update({
      where: { id: wallpaperId },
      data: { isFeatured: !wallpaper.isFeatured },
      select: { isFeatured: true },
    });

    revalidatePath("/admin/wallpapers");
    revalidatePath("/wallpapers");
    revalidatePath("/");

    return { success: true, data: { isFeatured: updated.isFeatured } };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to toggle featured",
    };
  }
};
