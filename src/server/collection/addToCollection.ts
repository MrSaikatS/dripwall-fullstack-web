"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const addToCollection = async (
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

    // Check if wallpaper exists
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id: wallpaperId },
    });

    if (!wallpaper) {
      return { success: false, error: "Wallpaper not found" };
    }

    // Check for duplicate
    const existing = await prisma.collectionItem.findUnique({
      where: {
        collectionId_wallpaperId: { collectionId, wallpaperId },
      },
    });

    if (existing) {
      return { success: false, error: "Wallpaper already in collection" };
    }

    await prisma.collectionItem.create({
      data: { collectionId, wallpaperId },
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${collectionId}`);
    revalidatePath(`/wallpapers/${wallpaperId}`);

    return { success: true };
  } catch (error) {
    console.error("Add to collection error:", error);
    return {
      success: false,
      error:
        error instanceof Error ?
          error.message
        : "Failed to add wallpaper to collection",
    };
  }
};
