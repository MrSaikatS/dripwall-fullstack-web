import type { Metadata } from "next";
import { DashboardWallpapersContent } from "./DashboardWallpapersContent";

export const metadata: Metadata = {
  title: "My Wallpapers",
  description: "Manage your uploaded wallpapers.",
};

const DashboardWallpapersPage = () => {
  return <DashboardWallpapersContent />;
};

export default DashboardWallpapersPage;
