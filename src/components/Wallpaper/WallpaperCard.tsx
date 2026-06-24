"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import { Badge } from "@/components/shadcnui/badge";
import { Card, CardContent, CardFooter } from "@/components/shadcnui/card";
import { Heart } from "lucide-react";
import { clientEnv } from "@/lib/env/clientEnv";
import type { WallpaperListItem } from "@/server/wallpaper/getWallpapers";
import { Route } from "next";
import Link from "next/link";

type WallpaperCardProps = {
  wallpaper: WallpaperListItem;
};

export const WallpaperCard = ({ wallpaper }: WallpaperCardProps) => {
  const thumbnailUrl =
    wallpaper.thumbnailUrl ||
    wallpaper.imageUrl ||
    `${clientEnv.NEXT_PUBLIC_S3_PUBLIC_URL}/placeholder.svg`;

  const aspectRatioClass = getAspectRatioClass(
    wallpaper.width,
    wallpaper.height,
  );

  return (
    <Link href={`/wallpapers/${wallpaper.id}` as Route}>
      <Card className="group cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-lg">
        {/* Thumbnail */}
        <CardContent
          className={`bg-muted relative overflow-hidden px-0 ${aspectRatioClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={wallpaper.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {wallpaper.isFeatured && (
            <Badge className="absolute top-2 left-2">Featured</Badge>
          )}
        </CardContent>

        {/* Info */}
        <CardFooter className="flex items-center gap-2 px-3 pt-3 pb-3">
          <Avatar size="sm">
            <AvatarImage
              src={wallpaper.user.image || undefined}
              alt={wallpaper.user.name}
            />
            <AvatarFallback>
              {wallpaper.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{wallpaper.title}</p>
            <p className="text-muted-foreground truncate text-xs">
              {wallpaper.user.name}
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Heart className="h-3 w-3" />
            <span>{wallpaper._count.likes}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

function getAspectRatioClass(
  width: number | null,
  height: number | null,
): string {
  if (!width || !height) return "aspect-[4/3]";
  const ratio = width / height;

  if (ratio > 1.7) return "aspect-video";
  if (ratio > 1.3) return "aspect-[4/3]";
  if (ratio > 0.9) return "aspect-square";
  if (ratio > 0.6) return "aspect-[3/4]";
  return "aspect-[9/16]";
}
