"use client";

import { Button } from "@/components/shadcnui/button";
import { Card } from "@/components/shadcnui/card";
import { Skeleton } from "@/components/shadcnui/skeleton";
import { clientEnv } from "@/lib/env/clientEnv";
import { deleteCollection } from "@/server/collection/deleteCollection";
import type { CollectionDetailItem } from "@/server/collection/getCollectionById";
import { getCollectionById } from "@/server/collection/getCollectionById";
import { removeFromCollection } from "@/server/collection/removeFromCollection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";
import {
  ArrowLeftIcon,
  BookHeartIcon,
  FolderLockIcon,
  GlobeIcon,
  HeartIcon,
  LoaderIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type CollectionDetailContentProps = {
  collectionId: string;
  userId: string;
};

export const CollectionDetailContent = ({
  collectionId,
  userId,
}: CollectionDetailContentProps) => {
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionDetailItem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await getCollectionById(collectionId);
      if (!cancelled) {
        if (result.success) {
          setCollection(result.data);
        } else {
          toast.error(result.error ?? "Failed to load collection");
        }
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  const handleRemove = async (wallpaperId: string) => {
    setRemovingId(wallpaperId);
    const result = await removeFromCollection(collectionId, wallpaperId);
    setRemovingId(null);

    if (result.success) {
      toast.success("Removed from collection");
      setCollection((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.wallpaperId !== wallpaperId),
        };
      });
    } else {
      toast.error(result.error ?? "Failed to remove");
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    const result = await deleteCollection(collectionId);
    setDeleting(false);

    if (result.success) {
      toast.success("Collection deleted");
      router.replace("/collections" as Route);
    } else {
      toast.error(result.error ?? "Failed to delete collection");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
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

  if (!collection) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Collection not found.</p>
        <Link
          href={"/collections" as Route}
          className="text-primary mt-2 inline-block text-sm underline-offset-4 hover:underline">
          Back to collections
        </Link>
      </div>
    );
  }

  const isOwner = collection.userId === userId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={"/collections" as Route}>
              <Button
                variant="ghost"
                size="icon-sm">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{collection.name}</h1>
          </div>
          {collection.description && (
            <p className="text-muted-foreground ml-10">
              {collection.description}
            </p>
          )}
          <div className="text-muted-foreground ml-10 flex items-center gap-3 text-sm">
            <span>
              {collection._count.items}{" "}
              {collection._count.items === 1 ? "wallpaper" : "wallpapers"}
            </span>
            <span className="flex items-center gap-1">
              {collection.isPublic ?
                <GlobeIcon className="h-3.5 w-3.5" />
              : <FolderLockIcon className="h-3.5 w-3.5" />}
              {collection.isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>

        {isOwner && (
          <Dialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting}>
              {deleting ?
                <LoaderIcon className="animate-spin" />
              : <Trash2Icon />}
              Delete
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Collection</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &ldquo;{collection.name}
                  &rdquo;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteConfirm}>
                  Delete Collection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Wallpaper Grid */}
      {collection.items.length === 0 ?
        <div className="py-12 text-center">
          <BookHeartIcon className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="text-muted-foreground mt-4">
            This collection is empty.
          </p>
          <Link
            href={"/wallpapers" as Route}
            className="text-primary mt-2 inline-block text-sm underline-offset-4 hover:underline">
            Browse wallpapers
          </Link>
        </div>
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.items.map((item) => {
            const wallpaper = item.wallpaper;
            const thumbnailUrl =
              wallpaper.thumbnailUrl ||
              wallpaper.imageUrl ||
              `${clientEnv.NEXT_PUBLIC_S3_PUBLIC_URL}/placeholder.svg`;

            return (
              <Card
                key={item.wallpaperId}
                className="group relative overflow-hidden">
                <Link href={`/wallpapers/${wallpaper.id}`}>
                  <div className="bg-muted aspect-4/3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl}
                      alt={wallpaper.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">
                      {wallpaper.title}
                    </p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <span>by {wallpaper.user.name}</span>
                      <span>&middot;</span>
                      <HeartIcon className="h-3 w-3" />
                      <span>{wallpaper._count.likes}</span>
                    </div>
                  </div>
                </Link>

                {isOwner && (
                  <button
                    type="button"
                    onClick={() => handleRemove(item.wallpaperId)}
                    disabled={removingId === item.wallpaperId}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-70 transition-opacity hover:bg-black/70 hover:opacity-100 disabled:opacity-50"
                    aria-label={`Remove ${wallpaper.title} from collection`}>
                    {removingId === item.wallpaperId ?
                      <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
                    : <XIcon className="h-3.5 w-3.5" />}
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      }
    </div>
  );
};
