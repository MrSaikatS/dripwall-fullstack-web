"use client";

import { Card } from "@/components/shadcnui/card";
import type { CollectionListItem } from "@/server/collection/getCollections";
import { BookHeartIcon, FolderLockIcon, GlobeIcon } from "lucide-react";
import { Route } from "next";
import Link from "next/link";

type CollectionCardProps = {
  collection: CollectionListItem;
};

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link href={`/collections/${collection.id}` as Route}>
      <Card className="group cursor-pointer p-4 transition-shadow hover:shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <BookHeartIcon className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium">
                {collection.name}
              </h3>
              {collection.description && (
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
          <span>
            {collection._count.items}{" "}
            {collection._count.items === 1 ? "wallpaper" : "wallpapers"}
          </span>
          <span className="flex items-center gap-1">
            {collection.isPublic ?
              <GlobeIcon className="h-3 w-3" />
            : <FolderLockIcon className="h-3 w-3" />}
            {collection.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </Card>
    </Link>
  );
};
