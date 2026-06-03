import { getAllWallpapersAdmin } from "@/server/admin/getAllWallpapersAdmin";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminWallpapersContent } from "@/components/Admin/AdminWallpapersContent";

export const metadata: Metadata = {
  title: "Admin — Wallpapers",
  description: "Browse and manage all wallpapers.",
};

type Props = {
  searchParams: Promise<{ page?: string; sort?: string; order?: string }>;
};

const AdminWallpapersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sortField = params.sort;
  const sortOrder = params.order;
  const result = await getAllWallpapersAdmin(page, 20, sortField, sortOrder);

  if (result && result.page !== page) {
    redirect(`/admin/wallpapers?page=${result.page}`);
  }

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
        sortField={sortField}
        sortOrder={sortOrder as "asc" | "desc" | undefined}
      />
    </div>
  );
};

export default AdminWallpapersPage;
