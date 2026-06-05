"use server";

import prisma from "@/lib/database/dbClient";
import { Prisma } from "@generated/prisma/client";

export type CategoryListItem = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    imageUrl: true;
    _count: {
      select: {
        wallpapers: true;
      };
    };
  };
}>;

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
