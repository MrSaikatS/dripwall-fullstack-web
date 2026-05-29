import { WallpaperDetail } from "@/components/Wallpaper/WallpaperDetail";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { PageParams } from "@/lib/types";
import { getWallpaperById } from "@/server/wallpaper/getWallpaperById";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type WallpaperDetailPageProps = PageParams<{ id: string }>;

const WallpaperDetailPage = async ({ params }: WallpaperDetailPageProps) => {
  const { id } = await params;
  const wallpaper = await getWallpaperById(id);

  if (!wallpaper) {
    notFound();
  }

  // Check if the current user has liked this wallpaper
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let isLiked = false;
  if (session?.user?.id) {
    const like = await prisma.like.findUnique({
      where: {
        userId_wallpaperId: {
          userId: session.user.id,
          wallpaperId: id,
        },
      },
    });
    isLiked = !!like;
  }

  // Increment view count
  await prisma.wallpaper.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="p-6">
      <WallpaperDetail
        wallpaper={wallpaper}
        isLiked={isLiked}
        isAuthenticated={!!session?.user}
      />
    </div>
  );
};

export default WallpaperDetailPage;
