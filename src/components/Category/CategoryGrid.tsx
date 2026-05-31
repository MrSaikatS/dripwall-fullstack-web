"use client";

import type { CategoryListItem } from "@/server/category/getCategories";
import { CategoryCard } from "./CategoryCard";

type CategoryGridProps = {
  categories: CategoryListItem[];
};

export const CategoryGrid = ({ categories }: CategoryGridProps) => {
  if (categories.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-muted-foreground text-center">
          No categories found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};
