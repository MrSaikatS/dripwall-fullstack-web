import { Separator } from "@/components/shadcnui/separator";
import { getWallpapers } from "@/server/wallpaper/getWallpapers";
import { Suspense } from "react";
import { WallpapersPageContent } from "../../../components/Wallpaper/WallpapersPageContent";

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
          <div className="flex min-h-100 items-center justify-center">
            <p className="text-muted-foreground">Loading wallpapers...</p>
          </div>
        }>
        <WallpapersPageContent initialData={initialData} />
      </Suspense>
    </div>
  );
};

export default WallpapersPage;
