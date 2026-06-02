"use client";

import { Button } from "@/components/shadcnui/button";
import { DataTable } from "@/components/shadcnui/data-table";
import type { AdminWallpaperItem } from "@/server/admin/getAllWallpapersAdmin";
import Link from "next/link";

import { useWallpaperColumns } from "./wallpapers-columns";

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
  const { columns, renderDeleteDialog } = useWallpaperColumns();

  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <p>No wallpapers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={wallpapers}
        showPagination={false}
      />
      {renderDeleteDialog()}

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
