import type { Metadata } from "next";
import { DashboardLikesContent } from "@/components/Dashboard/DashboardLikesContent";

export const metadata: Metadata = {
  title: "Liked Wallpapers",
  description: "Wallpapers you've liked.",
};

const DashboardLikesPage = () => {
  return <DashboardLikesContent />;
};

export default DashboardLikesPage;
