"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { CollectionCreateFormType } from "@/lib/zodSchema";
import { collectionCreateSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const updateCollection = async (
  id: string,
  data: Partial<CollectionCreateFormType>,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify ownership
    const existing = await prisma.collection.findUnique({ where: { id } });

    if (!existing) {
      return { success: false, error: "Collection not found" };
    }

    if (existing.userId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    const parsed = collectionCreateSchema.partial().safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    await prisma.collection.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Update collection error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update collection",
    };
  }
};
