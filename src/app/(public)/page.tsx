import { CategoryGrid } from "@/components/Category/CategoryGrid";
import { WallpaperGrid } from "@/components/Wallpaper/WallpaperGrid";
import { Button } from "@/components/shadcnui/button";
import { getCategories } from "@/server/category/getCategories";
import { getWallpapers } from "@/server/wallpaper/getWallpapers";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DripWall — Beautiful Wallpapers",
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
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-20">
        <div className="space-y-5">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Beautiful wallpapers,
            <br />
            curated for your screen.
          </h1>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
            Discover a growing collection of high-quality wallpapers. Browse
            categories, save your favourites, and share your own.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/wallpapers">
              <Button>
                Browse wallpapers
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="ghost">Upload yours</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-border/40 border-t">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-medium">Featured</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Hand-picked wallpapers
              </p>
            </div>
            {featured.data.length > 0 && (
              <Link
                href="/wallpapers"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                View all
              </Link>
            )}
          </div>
          {featured.data.length > 0 ?
            <WallpaperGrid wallpapers={featured.data} />
          : <p className="text-muted-foreground text-sm">
              No featured wallpapers yet.
            </p>
          }
        </div>
      </section>

      <section className="border-border/40 border-t">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-medium">Latest</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Recently added wallpapers
              </p>
            </div>
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
        <section className="border-border/40 border-t">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-medium">Categories</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Browse by theme
                </p>
              </div>
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

      <section className="border-border/40 border-t">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="space-y-4">
            <h2 className="text-2xl font-medium">Got a wallpaper to share?</h2>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Upload your collection and share it with the world.
            </p>
            <Link href="/upload">
              <Button variant="outline">
                Start uploading
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
