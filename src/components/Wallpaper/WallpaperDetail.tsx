"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import { Badge } from "@/components/shadcnui/badge";
import { Card } from "@/components/shadcnui/card";
import { Separator } from "@/components/shadcnui/separator";
import type { WallpaperDetailData } from "@/server/wallpaper/getWallpaperById";
import { CalendarIcon, EyeIcon, RulerIcon } from "lucide-react";
import Link from "next/link";
import { DownloadButton } from "./DownloadButton";
import { LikeButton } from "./LikeButton";

type WallpaperDetailProps = {
  wallpaper: WallpaperDetailData;
  isLiked: boolean;
  isAuthenticated: boolean;
};

export const WallpaperDetail = ({
  wallpaper,
  isLiked,
}: WallpaperDetailProps) => {
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Main Image */}
      <div className="bg-muted overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{wallpaper.title}</h1>
          {wallpaper.description && (
            <p className="text-muted-foreground max-w-2xl">
              {wallpaper.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LikeButton
            wallpaperId={wallpaper.id}
            initialLiked={isLiked}
            initialLikesCount={wallpaper._count.likes}
          />
          <DownloadButton
            wallpaperId={wallpaper.id}
            downloadCount={wallpaper.downloadCount}
          />
        </div>
      </div>

      {/* Metadata */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {/* Uploader */}
          <div className="col-span-2 space-y-2 sm:col-span-1 md:col-span-2">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Uploaded by
            </p>
            <Link
              href={
                `/dashboard/wallpapers?user=${wallpaper.user.id}` as unknown as never
              }
              className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage
                  src={wallpaper.user.image || undefined}
                  alt={wallpaper.user.name}
                />
                <AvatarFallback>
                  {wallpaper.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{wallpaper.user.name}</span>
            </Link>
          </div>

          {/* Dimensions */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Dimensions
            </p>
            <div className="flex items-center gap-1 text-sm">
              <RulerIcon className="h-3.5 w-3.5" />
              {wallpaper.width && wallpaper.height ?
                `${wallpaper.width} × ${wallpaper.height}`
              : "Unknown"}
            </div>
          </div>

          {/* File Size */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              File Size
            </p>
            <p className="text-sm">{formatFileSize(wallpaper.fileSize)}</p>
          </div>

          {/* Format */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Format
            </p>
            <Badge
              variant="outline"
              className="uppercase">
              {wallpaper.format || "Unknown"}
            </Badge>
          </div>

          {/* Views */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Views
            </p>
            <div className="flex items-center gap-1 text-sm">
              <EyeIcon className="h-3.5 w-3.5" />
              {wallpaper.viewCount}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Uploaded
            </p>
            <div className="flex items-center gap-1 text-sm">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formatDate(wallpaper.createdAt)}
            </div>
          </div>

          {/* Category */}
          {wallpaper.category && (
            <>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Category
                </p>
                <Link
                  href={
                    `/categories/${wallpaper.category.slug}` as unknown as never
                  }>
                  <Badge variant="secondary">{wallpaper.category.name}</Badge>
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Tags */}
      {wallpaper.tags.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {wallpaper.tags.map(({ tag }) => (
                <Badge
                  key={tag.id}
                  variant="outline">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Featured Badge */}
      {wallpaper.isFeatured && (
        <Badge
          className="absolute top-4 right-4"
          variant="default">
          Featured
        </Badge>
      )}
    </div>
  );
};
