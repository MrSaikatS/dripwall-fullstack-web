"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type DeleteCategoryResult = {
  success: boolean;
  error?: string;
};

export const deleteCategory = async (
  id: string,
): Promise<DeleteCategoryResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return { success: false, error: "Not authorized" };
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    const wallpaperCount = await prisma.wallpaper.count({
      where: { categoryId: id },
    });

    if (wallpaperCount > 0) {
      return {
        success: false,
        error: `Cannot delete category used by ${wallpaperCount} wallpaper(s)`,
      };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/wallpapers");

    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
};
