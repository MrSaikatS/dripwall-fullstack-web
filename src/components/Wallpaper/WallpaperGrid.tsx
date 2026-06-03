"use client";

import type { WallpaperListItem } from "@/server/wallpaper/getWallpapers";
import Masonry from "react-masonry-css";
import { WallpaperCard } from "./WallpaperCard";

const breakpointCols = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1,
};

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
    <Masonry
      breakpointCols={breakpointCols}
      className="masonry-grid"
      columnClassName="masonry-grid-column">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
        />
      ))}
    </Masonry>
  );
};
