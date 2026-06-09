import { Skeleton } from "@/components/shadcnui/skeleton";
import { Separator } from "@/components/shadcnui/separator";
import { getWallpapers } from "@/server/wallpaper/getWallpapers";
import type { Metadata } from "next";
import { Suspense } from "react";
import { WallpapersPageContent } from "../../../components/Wallpaper/WallpapersPageContent";

export const metadata: Metadata = {
  title: "Wallpapers",
  description: "Browse our collection of high-quality wallpapers.",
};

type WallpapersPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    sortBy?: string;
  }>;
};

const WallpapersPage = async ({ searchParams }: WallpapersPageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search;
  const categoryId = params.categoryId;
  const sortBy = params.sortBy as
    | "newest"
    | "popular"
    | "downloads"
    | undefined;

  const initialData = await getWallpapers({
    page,
    pageSize: 12,
    search,
    categoryId,
    sortBy,
  });

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Wallpapers</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of high-quality wallpapers
        </p>
      </div>

      <Separator />

      <Suspense
        fallback={
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="mb-4 h-64 w-full rounded-xl"
              />
            ))}
          </div>
        }>
        <WallpapersPageContent initialData={initialData} />
      </Suspense>
    </div>
  );
};

export default WallpapersPage;
