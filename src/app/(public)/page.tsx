import { CategoryGrid } from "@/components/Category/CategoryGrid";
import { WallpaperGrid } from "@/components/Wallpaper/WallpaperGrid";
import { Button } from "@/components/shadcnui/button";
import { getCategories } from "@/server/category/getCategories";
import { getWallpapers } from "@/server/wallpaper/getWallpapers";
import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description:
    "Discover, collect, and share stunning wallpapers. DripWall is your destination for high-quality wallpapers.",
};

const HomePage = async () => {
  const [featured, latest, categories] = await Promise.all([
    getWallpapers({ isFeatured: true, pageSize: 4 }),
    getWallpapers({ pageSize: 8, sortBy: "newest" }),
    getCategories(),
  ]);

  return (
    <div>
      <section className="px-4 pt-20 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-medium tracking-tight sm:text-6xl">
            Beautiful wallpapers,
            <br />
            curated for your screen.
          </h1>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed">
            Discover a growing collection of high-quality wallpapers. Browse
            categories, save your favourites, and share your own.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/wallpapers">
              <Button size="lg">
                Browse wallpapers
                <ArrowUpRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="ghost" size="lg">
                Upload yours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-medium tracking-tight">
            Featured
          </h2>
          {featured.data.length > 0 ?
            <WallpaperGrid wallpapers={featured.data} />
          : <p className="text-muted-foreground text-sm">
              No featured wallpapers yet.
            </p>
          }
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-3xl font-medium tracking-tight">Latest</h2>
            <Link
              href="/wallpapers"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              View all
            </Link>
          </div>
          <WallpaperGrid wallpapers={latest.data} />
        </div>
      </section>

      {categories.length > 0 && (
        <section className="px-4 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-3xl font-medium tracking-tight">
                Categories
              </h2>
              <Link
                href="/categories"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                View all
              </Link>
            </div>
            <CategoryGrid categories={categories} />
          </div>
        </section>
      )}

      <section className="px-4 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-medium tracking-tight">
            Got a wallpaper to share?
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Upload your collection and share it with the world.
          </p>
          <div className="mt-6">
            <Link href="/upload">
              <Button variant="outline" size="lg">
                Start uploading
                <ArrowUpRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
