"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type CollectionDetailItem = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  items: {
    collectionId: string;
    wallpaperId: string;
    createdAt: Date;
    wallpaper: {
      id: string;
      title: string;
      thumbnailUrl: string | null;
      imageUrl: string;
      width: number | null;
      height: number | null;
      format: string | null;
      downloadCount: number;
      viewCount: number;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
      _count: {
        likes: number;
      };
    };
  }[];
  _count: {
    items: number;
  };
};

export const getCollectionById = async (
  id: string,
): Promise<
  | { success: true; data: CollectionDetailItem }
  | { success: false; error: string }
> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        items: {
          orderBy: { createdAt: "desc" },
          select: {
            collectionId: true,
            wallpaperId: true,
            createdAt: true,
            wallpaper: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                imageUrl: true,
                width: true,
                height: true,
                format: true,
                downloadCount: true,
                viewCount: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
                _count: {
                  select: { likes: true },
                },
              },
            },
          },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    // Allow access if public or owned by user
    if (!collection.isPublic && collection.userId !== session.user.id) {
      return { success: false, error: "Collection not found" };
    }

    return { success: true, data: collection };
  } catch (error) {
    console.error("Get collection by id error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch collection",
    };
  }
};
