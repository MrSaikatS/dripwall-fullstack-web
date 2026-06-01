import WallpaperUploadForm from "@/components/Wallpaper/WallpaperUploadForm";
import prisma from "@/lib/database/dbClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload and share your wallpapers with the DripWall community",
};

const UploadPage = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Upload Wallpaper</h1>

        <p className="text-muted-foreground mt-2">
          Share your stunning wallpapers with the community
        </p>
      </div>

      <WallpaperUploadForm categories={categories} />
    </section>
  );
};

export default UploadPage;
