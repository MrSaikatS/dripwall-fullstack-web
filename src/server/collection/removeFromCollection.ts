"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const removeFromCollection = async (
  collectionId: string,
  wallpaperId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify ownership
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    if (collection.userId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.collectionItem.delete({
      where: {
        collectionId_wallpaperId: { collectionId, wallpaperId },
      },
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${collectionId}`);
    revalidatePath(`/wallpapers/${wallpaperId}`);

    return { success: true };
  } catch (error) {
    console.error("Remove from collection error:", error);
    return {
      success: false,
      error:
        error instanceof Error ?
          error.message
        : "Failed to remove wallpaper from collection",
    };
  }
};
