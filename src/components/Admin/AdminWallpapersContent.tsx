"use client";

import type { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/shadcnui/button";
import { DataTable } from "@/components/shadcnui/data-table";
import type { AdminWallpaperItem } from "@/server/admin/getAllWallpapersAdmin";
import Link from "next/link";

import { useWallpaperColumns } from "./wallpapers-columns";

type AdminWallpapersContentProps = {
  wallpapers: AdminWallpaperItem[];
  currentPage: number;
  totalPages: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
};

export const AdminWallpapersContent = ({
  wallpapers,
  currentPage,
  totalPages,
  sortField,
  sortOrder,
}: AdminWallpapersContentProps) => {
  const router = useRouter();
  const { columns, renderDeleteDialog } = useWallpaperColumns();

  const sorting: SortingState =
    sortField && sortOrder ?
      [{ id: sortField, desc: sortOrder === "desc" }]
    : [];

  const sortParam =
    sortField && sortOrder ? `&sort=${sortField}&order=${sortOrder}` : "";

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      if (newSorting.length === 0) {
        router.push("/admin/wallpapers?page=1");
      } else {
        const { id, desc } = newSorting[0];
        router.push(
          `/admin/wallpapers?page=1&sort=${id}&order=${desc ? "desc" : "asc"}`,
        );
      }
    },
    [router],
  );

  return (
    <div className="space-y-4">
      {wallpapers.length === 0 ?
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-12">
          <p>No wallpapers found</p>
        </div>
      : <>
          <DataTable
            columns={columns}
            data={wallpapers}
            showPagination={false}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            manualSorting
          />
          {renderDeleteDialog()}
        </>
      }

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={
              currentPage > 1 ?
                `/admin/wallpapers?page=${currentPage - 1}${sortParam}`
              : "#"
            }
            aria-disabled={currentPage <= 1}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}>
              Previous
            </Button>
          </Link>
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={
              currentPage < totalPages ?
                `/admin/wallpapers?page=${currentPage + 1}${sortParam}`
              : "#"
            }
            aria-disabled={currentPage >= totalPages}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}>
              Next
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
