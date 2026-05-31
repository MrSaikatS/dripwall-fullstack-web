"use client";

import { WallpaperCard } from "@/components/Wallpaper/WallpaperCard";
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {initialData.data.map((wallpaper) => (
          <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
        ))}
      </div>

      <Pagination
        currentPage={initialData.page}
        totalPages={initialData.totalPages}
        total={initialData.total}
      />
    </div>
  );
};
