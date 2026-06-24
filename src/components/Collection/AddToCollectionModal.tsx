"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
import { addToCollection } from "@/server/collection/addToCollection";
import type { CollectionListItem } from "@/server/collection/getCollections";
import { getCollections } from "@/server/collection/getCollections";
import { BookHeartIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CollectionForm } from "./CollectionForm";

type AddToCollectionModalProps = {
  wallpaperId: string;
};

export const AddToCollectionModal = ({
  wallpaperId,
}: AddToCollectionModalProps) => {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const loadCollections = useCallback(async () => {
    cancelledRef.current = false;
    setLoading(true);
    setShowCreateForm(false);

    const result = await getCollections();
    if (!cancelledRef.current) {
      if (result.success) {
        setCollections(result.data);
      }
      setLoading(false);
    }
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      loadCollections();
    }
  };

  const handleAdd = async (collectionId: string) => {
    setAdding(collectionId);
    const result = await addToCollection(collectionId, wallpaperId);
    setAdding(null);

    if (result.success) {
      toast.success("Added to collection!");
      setOpen(false);
    } else {
      toast.error(result.error ?? "Failed to add to collection");
    }
  };

  const handleCreated = () => {
    setShowCreateForm(false);
    loadCollections();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm">
            <BookHeartIcon /> Save
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
        </DialogHeader>

        {showCreateForm ?
          <div className="grid gap-4">
            <CollectionForm onSuccess={handleCreated} />
            <Button
              variant="ghost"
              onClick={() => setShowCreateForm(false)}>
              Back to collections
            </Button>
          </div>
        : <>
            {loading ?
              <div className="flex items-center justify-center py-8">
                <LoaderIcon className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            : collections.length === 0 ?
              <div className="grid gap-4 py-4 text-center">
                <p className="text-muted-foreground text-sm">
                  You don&rsquo;t have any collections yet.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}>
                  <PlusIcon /> Create your first collection
                </Button>
              </div>
            : <div className="grid max-h-64 gap-2 overflow-y-auto">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => handleAdd(collection.id)}
                    disabled={adding === collection.id}
                    className="hover:bg-muted flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors disabled:opacity-50">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <BookHeartIcon className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{collection.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {collection._count.items} wallpaper
                        {collection._count.items !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {adding === collection.id && (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    )}
                  </button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateForm(true)}
                  className="mt-2">
                  <PlusIcon /> New collection
                </Button>
              </div>
            }
          </>
        }
      </DialogContent>
    </Dialog>
  );
};
