"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { CollectionCreateFormType } from "@/lib/zodSchema";
import { collectionCreateSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type CreateCollectionResult = {
  success: boolean;
  data?: { id: string; name: string };
  error?: string;
};

export const createCollection = async (
  data: CollectionCreateFormType,
): Promise<CreateCollectionResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    const parsed = collectionCreateSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    const collection = await prisma.collection.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        isPublic: parsed.data.isPublic ?? true,
        userId: session.user.id,
      },
    });

    revalidatePath("/collections");

    return {
      success: true,
      data: { id: collection.id, name: collection.name },
    };
  } catch (error) {
    console.error("Create collection error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create collection",
    };
  }
};
