"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "react-toastify"

import { Badge } from "@/components/shadcnui/badge"
import { Button } from "@/components/shadcnui/button"
import { DataTableColumnHeader } from "@/components/shadcnui/data-table-column-header"
import type { AdminWallpaperItem } from "@/server/admin/getAllWallpapersAdmin"
import { deleteWallpaperAdmin } from "@/server/admin/deleteWallpaperAdmin"
import { toggleFeatured } from "@/server/admin/toggleFeatured"
import { ExternalLinkIcon, LoaderIcon, StarIcon, TrashIcon } from "lucide-react"

export const useWallpaperColumns = () => {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggleFeatured = useCallback(
    async (id: string) => {
      setLoadingId(`featured-${id}`)
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
        setLoadingId(null)
      }
    },
    [router],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this wallpaper permanently?")) return
      setLoadingId(`delete-${id}`)
      try {
        const result = await deleteWallpaperAdmin(id)
        if (result.success) {
          toast.success("Wallpaper deleted")
          router.refresh()
        } else {
          toast.error(result.error ?? "Failed to delete wallpaper")
        }
      } catch {
        toast.error("Failed to delete wallpaper")
      } finally {
        setLoadingId(null)
      }
    },
    [router],
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
            <Link href={`/wallpapers/${wp.id}`} target="_blank">
              <Button variant="ghost" size="sm" title="View wallpaper">
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
        )
      },
    },
  ]

  return columns
}
