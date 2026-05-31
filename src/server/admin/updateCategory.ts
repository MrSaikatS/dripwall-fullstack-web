"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { slugify } from "@/lib/utils";
import { categoryCreateSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type UpdateCategoryResult = {
  success: boolean;
  error?: string;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string },
): Promise<UpdateCategoryResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return { success: false, error: "Not authorized" };
    }

    const parsed = categoryCreateSchema.partial().safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    const updateData: { name?: string; slug?: string; description?: string } =
      {};

    if (parsed.data.name !== undefined) {
      updateData.name = parsed.data.name;
      const newSlug = slugify(parsed.data.name);
      if (newSlug !== existing.slug) {
        const slugExists = await prisma.category.findUnique({
          where: { slug: newSlug },
        });
        if (slugExists) {
          return {
            success: false,
            error: "A category with this name already exists",
          };
        }
        updateData.slug = newSlug;
      }
    }

    if (parsed.data.description !== undefined) {
      updateData.description = parsed.data.description ?? null;
    }

    await prisma.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/wallpapers");

    return { success: true };
  } catch (error) {
    console.error("Update category error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
