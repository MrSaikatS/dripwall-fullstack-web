"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type CollectionListItem = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    items: number;
  };
};

export const getCollections = async (): Promise<
  | { success: true; data: CollectionListItem[] }
  | { success: false; error: string }
> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    const collections = await prisma.collection.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { items: true },
        },
      },
    });

    return { success: true, data: collections };
  } catch (error) {
    console.error("Get collections error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch collections",
    };
  }
};
