"use client";

import { Input } from "@/components/shadcnui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnui/select";
import { Pagination } from "@/components/Wallpaper/Pagination";
import { WallpaperGrid } from "@/components/Wallpaper/WallpaperGrid";
import type { PaginatedResponse } from "@/lib/types";
import type { WallpaperListItem } from "@/server/wallpaper/getWallpapers";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type WallpapersPageContentProps = {
  initialData: PaginatedResponse<WallpaperListItem>;
};

export const WallpapersPageContent = ({
  initialData,
}: WallpapersPageContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      if (!updates.page) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `${pathname}?${createQueryString({ search: searchInput })}` as unknown as never,
    );
  };

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    router.push(
      `${pathname}?${createQueryString({ sortBy: value })}` as unknown as never,
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form
          onSubmit={handleSearch}
          className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search wallpapers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </form>

        <div className="flex gap-3">
          <Select
            value={searchParams.get("sortBy") || "newest"}
            onValueChange={handleSortChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Viewed</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <WallpaperGrid wallpapers={initialData.data} />

      {/* Pagination */}
      <Pagination
        currentPage={initialData.page}
        totalPages={initialData.totalPages}
        total={initialData.total}
      />
    </div>
  );
};
