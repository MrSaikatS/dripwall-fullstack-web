"use client";

import { Button } from "@/components/shadcnui/button";
import { Card } from "@/components/shadcnui/card";
import { Skeleton } from "@/components/shadcnui/skeleton";
import { getCollections } from "@/server/collection/getCollections";
import { getUserDownloads } from "@/server/user/getUserDownloads";
import { getUserLikes } from "@/server/user/getUserLikes";
import { getUserWallpapers } from "@/server/user/getUserWallpapers";
import { ArrowUpRight, Download, Grid3X3, Heart } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  wallpaperCount: number;
  likeCount: number;
  downloadCount: number;
  collectionCount: number;
};

type StatCard = {
  label: string;
  value: number;
  icon: typeof Grid3X3;
  href: Route;
  color: string;
  bgColor: string;
};

export const DashboardOverviewContent = () => {
  const [stats, setStats] = useState<DashboardStats>({
    wallpaperCount: 0,
    likeCount: 0,
    downloadCount: 0,
    collectionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [wallpapers, likes, downloads, collections] = await Promise.all([
          getUserWallpapers(),
          getUserLikes(),
          getUserDownloads(),
          getCollections(),
        ]);

        if (!cancelled) {
          setStats({
            wallpaperCount: wallpapers.total,
            likeCount: likes.total,
            downloadCount: downloads.total,
            collectionCount: collections.success ? collections.data.length : 0,
          });
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
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
  }, [retryCount]);

  const statCards: StatCard[] = [
    {
      label: "Wallpapers Uploaded",
      value: stats.wallpaperCount,
      icon: Grid3X3,
      href: "/dashboard/wallpapers" as Route,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Liked Wallpapers",
      value: stats.likeCount,
      icon: Heart,
      href: "/dashboard/likes" as Route,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Downloads",
      value: stats.downloadCount,
      icon: Download,
      href: "#" as Route,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Collections",
      value: stats.collectionCount,
      icon: Grid3X3,
      href: "/collections" as Route,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here&rsquo;s a summary of your activity.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="p-6">
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">
            Failed to load dashboard data. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setError(false);
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
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard. Here&rsquo;s a summary of your activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}>
              <Card className="group cursor-pointer p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${card.bgColor}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <ArrowUpRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-4 text-3xl font-bold">{card.value}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {card.label}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
