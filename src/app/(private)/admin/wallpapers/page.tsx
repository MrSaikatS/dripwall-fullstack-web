import { getAllWallpapersAdmin } from "@/server/admin/getAllWallpapersAdmin";
import type { Metadata } from "next";
import { AdminWallpapersContent } from "@/components/Admin/AdminWallpapersContent";

export const metadata: Metadata = {
  title: "Admin — Wallpapers",
  description: "Browse and manage all wallpapers.",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const AdminWallpapersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const result = await getAllWallpapersAdmin(page);

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Not authorized or failed to load
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wallpaper Management</h1>
        <p className="text-muted-foreground">
          Browse and manage all wallpapers
        </p>
      </div>

      <AdminWallpapersContent
        wallpapers={result.data}
        currentPage={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
};

export default AdminWallpapersPage;
