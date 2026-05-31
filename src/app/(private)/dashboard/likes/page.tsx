import type { Metadata } from "next";
import { DashboardLikesContent } from "./DashboardLikesContent";

export const metadata: Metadata = {
  title: "Liked Wallpapers",
  description: "Wallpapers you've liked.",
};

const DashboardLikesPage = () => {
  return <DashboardLikesContent />;
};

export default DashboardLikesPage;
