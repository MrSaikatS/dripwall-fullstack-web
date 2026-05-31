"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { categoryCreateSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type CreateCategoryResult = {
  success: boolean;
  data?: { id: string; name: string; slug: string };
  error?: string;
};

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const createCategory = async (
  data: { name: string; description?: string },
): Promise<CreateCategoryResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return { success: false, error: "Not authorized" };
    }

    const parsed = categoryCreateSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    const slug = slugify(parsed.data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A category with this name already exists" };
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/wallpapers");

    return {
      success: true,
      data: { id: category.id, name: category.name, slug: category.slug },
    };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
};
