"use client";

import type { WallpaperListItem } from "@/server/wallpaper/getWallpapers";
import { WallpaperCard } from "./WallpaperCard";

type WallpaperGridProps = {
  wallpapers: WallpaperListItem[];
};

export const WallpaperGrid = ({ wallpapers }: WallpaperGridProps) => {
  if (wallpapers.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-muted-foreground text-center">
          No wallpapers found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
        />
      ))}
    </div>
  );
};
