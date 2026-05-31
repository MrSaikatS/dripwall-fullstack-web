"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteCollection = async (
  id: string,
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

    await prisma.collection.delete({ where: { id } });

    revalidatePath("/collections");

    return { success: true };
  } catch (error) {
    console.error("Delete collection error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete collection",
    };
  }
};
