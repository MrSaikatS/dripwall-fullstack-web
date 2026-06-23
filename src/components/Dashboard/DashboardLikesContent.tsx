"use client";

import { Button } from "@/components/shadcnui/button";
import { Card } from "@/components/shadcnui/card";
import { Skeleton } from "@/components/shadcnui/skeleton";
import type { UserLikeItem } from "@/server/user/getUserLikes";
import { getUserLikes } from "@/server/user/getUserLikes";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const DashboardLikesContent = () => {
  const [likes, setLikes] = useState<UserLikeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await getUserLikes(page);
        if (!cancelled) {
          setLikes(result.data);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error("Load likes error:", error);
        if (!cancelled) {
          setError(true);
        }
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
  }, [page, retryCount]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Liked Wallpapers</h1>
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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Liked Wallpapers</h1>
        </div>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">
            Failed to load liked wallpapers. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setError(false);
              setPage(1);
              setLoading(true);
              setRetryCount((c) => c + 1);
            }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Liked Wallpapers</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {total} {total === 1 ? "wallpaper" : "wallpapers"} liked
        </p>
      </div>

      {likes.length === 0 ?
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <Heart className="text-muted-foreground h-12 w-12" />
          <div>
            <p className="text-lg font-medium">No liked wallpapers yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Browse wallpapers and click the heart icon to like them.
            </p>
          </div>
          <Link href="/wallpapers">
            <Button>Browse Wallpapers</Button>
          </Link>
        </Card>
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {likes.map((like) => (
            <Link
              key={like.wallpaper.id}
              href={`/wallpapers/${like.wallpaper.id}` as const}>
              <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                <div className="bg-muted aspect-4/3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={like.wallpaper.thumbnailUrl || like.wallpaper.imageUrl}
                    alt={like.wallpaper.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate font-medium">{like.wallpaper.title}</p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                    <span>{like.wallpaper.user.name}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {like.wallpaper._count.likes}
                    </span>
                    <span>{like.wallpaper.downloadCount} downloads</span>
                  </div>
                  {like.wallpaper.category && (
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {like.wallpaper.category.name}
                    </span>
                  )}
                  <span className="text-muted-foreground mt-1 block text-xs">
                    Liked {new Date(like.createdAt).toLocaleDateString()}
                  </span>
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
