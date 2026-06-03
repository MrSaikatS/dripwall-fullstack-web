"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "react-toastify"

import { Badge } from "@/components/shadcnui/badge"
import { Button } from "@/components/shadcnui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog"
import { DataTableColumnHeader } from "@/components/shadcnui/data-table-column-header"
import type { AdminWallpaperItem } from "@/server/admin/getAllWallpapersAdmin"
import { deleteWallpaperAdmin } from "@/server/admin/deleteWallpaperAdmin"
import { toggleFeatured } from "@/server/admin/toggleFeatured"
import { ExternalLinkIcon, LoaderIcon, StarIcon, TrashIcon } from "lucide-react"

export const useWallpaperColumns = () => {
  const router = useRouter()
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const markLoading = useCallback((id: string) => {
    setLoadingIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const clearLoading = useCallback((id: string) => {
    setLoadingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const handleToggleFeatured = useCallback(
    async (id: string) => {
      const key = `featured-${id}`
      markLoading(key)
      try {
        const result = await toggleFeatured(id)
        if (result.success) {
          toast.success(
            result.data?.isFeatured
              ? "Marked as featured"
              : "Removed from featured",
          )
          router.refresh()
        } else {
          toast.error(result.error ?? "Failed to toggle featured")
        }
      } catch {
        toast.error("Failed to toggle featured")
      } finally {
        clearLoading(key)
      }
    },
    [router, markLoading, clearLoading],
  )

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteTargetId(id)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return
    const key = `delete-${deleteTargetId}`
    markLoading(key)
    setIsDeleting(true)
    try {
      const result = await deleteWallpaperAdmin(deleteTargetId)
      if (result.success) {
        toast.success("Wallpaper deleted")
        router.refresh()
      } else {
        toast.error(result.error ?? "Failed to delete wallpaper")
      }
    } catch {
      toast.error("Failed to delete wallpaper")
    } finally {
      clearLoading(key)
      setIsDeleting(false)
      setDeleteTargetId(null)
    }
  }, [router, markLoading, clearLoading, deleteTargetId])

  const renderDeleteDialog = () => (
    <Dialog
      open={!!deleteTargetId}
      onOpenChange={(open) => {
        if (!open) setDeleteTargetId(null)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Wallpaper</DialogTitle>
          <DialogDescription>
            Delete this wallpaper permanently? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setDeleteTargetId(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const columns: ColumnDef<AdminWallpaperItem>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("title")}</span>
      ),
    },
    {
      accessorKey: "user.name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <span className="text-muted-foreground">{user.name}</span>
        )
      },
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category
        return category ? (
          <Badge variant="secondary">{category.name}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => {
        const isFeatured = row.getValue("isFeatured") as boolean
        return isFeatured ? (
          <Badge variant="default">Featured</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        )
      },
    },
    {
      accessorKey: "isPublic",
      header: "Public",
      cell: ({ row }) => {
        const isPublic = row.getValue("isPublic") as boolean
        return isPublic ? (
          <Badge variant="outline">Public</Badge>
        ) : (
          <Badge variant="destructive">Private</Badge>
        )
      },
    },
    {
      accessorKey: "downloadCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Downloads" />
      ),
    },
    {
      accessorKey: "_count.likes",
      id: "likes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Likes" />
      ),
      cell: ({ row }) => row.original._count.likes,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const wp = row.original
        return (
          <div className="flex gap-1">
            {loadingIds.has(`featured-${wp.id}`) ? (
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
            <Link href={`/wallpapers/${wp.id}`} target="_blank">
              <Button variant="ghost" size="sm" title="View wallpaper">
                <ExternalLinkIcon className="h-3 w-3" />
              </Button>
            </Link>
            {loadingIds.has(`delete-${wp.id}`) ? (
              <Button variant="ghost" size="sm" disabled>
                <LoaderIcon className="h-3 w-3 animate-spin" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteRequest(wp.id)}
                title="Delete wallpaper"
              >
                <TrashIcon className="h-3 w-3 text-destructive" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return { columns, renderDeleteDialog }
}
