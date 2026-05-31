"use server";

import prisma from "@/lib/database/dbClient";

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count: {
    wallpapers: number;
  };
};

export const getCategories = async (): Promise<CategoryListItem[]> => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      _count: {
        select: {
          wallpapers: true,
        },
      },
    },
  });

  return categories;
};
