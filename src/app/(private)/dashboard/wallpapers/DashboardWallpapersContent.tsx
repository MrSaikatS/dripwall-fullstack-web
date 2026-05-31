"use client";

import { Button } from "@/components/shadcnui/button";
import { Card } from "@/components/shadcnui/card";
import { Skeleton } from "@/components/shadcnui/skeleton";
import type { UserWallpaperItem } from "@/server/user/getUserWallpapers";
import { getUserWallpapers } from "@/server/user/getUserWallpapers";
import { Heart, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const DashboardWallpapersContent = () => {
  const [wallpapers, setWallpapers] = useState<UserWallpaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await getUserWallpapers(page);
        if (!cancelled) {
          setWallpapers(result.data);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error("Load wallpapers error:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Wallpapers</h1>
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-4/3 w-full rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wallpapers</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {total} {total === 1 ? "wallpaper" : "wallpapers"} uploaded
          </p>
        </div>
        <Link href="/upload">
          <Button size="sm">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </Link>
      </div>

      {wallpapers.length === 0 ?
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <Upload className="text-muted-foreground h-12 w-12" />
          <div>
            <p className="text-lg font-medium">No wallpapers yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Upload your first wallpaper to get started.
            </p>
          </div>
          <Link href="/upload">
            <Button>Upload Wallpaper</Button>
          </Link>
        </Card>
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallpapers.map((wp) => (
            <Link
              key={wp.id}
              href={`/wallpapers/${wp.id}` as const}>
              <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                <div className="bg-muted aspect-4/3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wp.thumbnailUrl || wp.imageUrl}
                    alt={wp.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate font-medium">{wp.title}</p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                    <span>
                      {wp.width}&times;{wp.height}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {wp._count.likes}
                    </span>
                    <span>{wp.downloadCount} downloads</span>
                  </div>
                  {wp.category && (
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {wp.category.name}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      }

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
