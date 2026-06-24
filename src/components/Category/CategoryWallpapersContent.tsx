"use client";

import { WallpaperGrid } from "@/components/Wallpaper/WallpaperGrid";
import { Pagination } from "@/components/Wallpaper/Pagination";
import type { PaginatedResponse } from "@/lib/types";
import type {
  CategoryDetailData,
  CategoryWallpaperItem,
} from "@/server/category/getCategoryBySlug";

type CategoryWallpapersContentProps = {
  category: CategoryDetailData;
  initialData: PaginatedResponse<CategoryWallpaperItem>;
};

export const CategoryWallpapersContent = ({
  initialData,
}: CategoryWallpapersContentProps) => {
  if (initialData.data.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-muted-foreground text-center">
          No wallpapers in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WallpaperGrid wallpapers={initialData.data} />

      <Pagination
        currentPage={initialData.page}
        totalPages={initialData.totalPages}
        total={initialData.total}
      />
    </div>
  );
};
