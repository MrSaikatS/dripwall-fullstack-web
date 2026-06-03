import type { Metadata } from "next";
import { getUserWallpapers } from "@/server/user/getUserWallpapers";
import { DashboardWallpapersContent } from "@/components/Dashboard/DashboardWallpapersContent";

export const metadata: Metadata = {
  title: "My Wallpapers",
  description: "Manage your uploaded wallpapers.",
};

const DashboardWallpapersPage = async () => {
  const initialData = await getUserWallpapers(1);

  return <DashboardWallpapersContent initialData={initialData} />;
};

export default DashboardWallpapersPage;
