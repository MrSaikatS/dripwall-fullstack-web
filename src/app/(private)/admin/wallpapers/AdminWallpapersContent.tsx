"use client";

import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import type { AdminWallpaperItem } from "@/server/admin/getAllWallpapersAdmin";
import { deleteWallpaperAdmin } from "@/server/admin/deleteWallpaperAdmin";
import { toggleFeatured } from "@/server/admin/toggleFeatured";
import {
  ExternalLinkIcon,
  LoaderIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type AdminWallpapersContentProps = {
  wallpapers: AdminWallpaperItem[];
  currentPage: number;
  totalPages: number;
};

export const AdminWallpapersContent = ({
  wallpapers,
  currentPage,
  totalPages,
}: AdminWallpapersContentProps) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleFeatured = async (id: string) => {
    setLoadingId(`featured-${id}`);
    try {
      const result = await toggleFeatured(id);
      if (result.success) {
        toast.success(
          result.data?.isFeatured
            ? "Marked as featured"
            : "Removed from featured",
        );
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to toggle featured");
      }
    } catch {
      toast.error("Failed to toggle featured");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this wallpaper permanently?")) return;
    setLoadingId(`delete-${id}`);
    try {
      const result = await deleteWallpaperAdmin(id);
      if (result.success) {
        toast.success("Wallpaper deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete wallpaper");
      }
    } catch {
      toast.error("Failed to delete wallpaper");
    } finally {
      setLoadingId(null);
    }
  };

  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <p>No wallpapers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Public</th>
              <th className="px-4 py-3 font-medium">Downloads</th>
              <th className="px-4 py-3 font-medium">Likes</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallpapers.map((wp) => (
              <tr key={wp.id} className="border-b">
                <td className="px-4 py-3 font-medium">{wp.title}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {wp.user.name}
                </td>
                <td className="px-4 py-3">
                  {wp.category ? (
                    <Badge variant="secondary">{wp.category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {wp.isFeatured ? (
                    <Badge variant="default">Featured</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {wp.isPublic ? (
                    <Badge variant="outline">Public</Badge>
                  ) : (
                    <Badge variant="destructive">Private</Badge>
                  )}
                </td>
                <td className="px-4 py-3">{wp.downloadCount}</td>
                <td className="px-4 py-3">{wp._count.likes}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {loadingId === `featured-${wp.id}` ? (
                      <Button variant="ghost" size="sm" disabled>
                        <LoaderIcon className="h-3 w-3 animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(wp.id)}
                        title="Toggle featured"
                      >
                        <StarIcon
                          className={`h-3 w-3 ${wp.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`}
                        />
                      </Button>
                    )}
                    <Link
                      href={`/wallpapers/${wp.id}`}
                      target="_blank"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View wallpaper"
                      >
                        <ExternalLinkIcon className="h-3 w-3" />
                      </Button>
                    </Link>
                    {loadingId === `delete-${wp.id}` ? (
                      <Button variant="ghost" size="sm" disabled>
                        <LoaderIcon className="h-3 w-3 animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(wp.id)}
                        title="Delete wallpaper"
                      >
                        <TrashIcon className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`/admin/wallpapers?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/admin/wallpapers?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
