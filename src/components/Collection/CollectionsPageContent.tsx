"use client";

import { CollectionCard } from "@/components/Collection/CollectionCard";
import { CollectionForm } from "@/components/Collection/CollectionForm";
import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
import { Skeleton } from "@/components/shadcnui/skeleton";
import type { CollectionListItem } from "@/server/collection/getCollections";
import { getCollections } from "@/server/collection/getCollections";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const CollectionsPageContent = () => {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load collections on mount using a callback-based pattern
  // to avoid cascading setState warnings from React Compiler
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await getCollections();
      if (!cancelled && result.success) {
        setCollections(result.data);
      }
      if (!cancelled) {
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreated = () => {
    setDialogOpen(false);

    // Refresh the list
    const refresh = async () => {
      const result = await getCollections();
      if (result.success) {
        setCollections(result.data);
      }
    };
    refresh();
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 w-full rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {collections.length}{" "}
          {collections.length === 1 ? "collection" : "collections"}
        </p>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <PlusIcon /> New Collection
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <CollectionForm onSuccess={handleCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 ?
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">
            You haven&rsquo;t created any collections yet.
          </p>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(true)}>
            <PlusIcon /> Create Your First Collection
          </Button>
        </div>
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      }
    </div>
  );
};
