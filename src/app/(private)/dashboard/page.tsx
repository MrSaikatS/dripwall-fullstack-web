import type { Metadata } from "next";
import { DashboardOverviewContent } from "@/components/Dashboard/DashboardOverviewContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your DripWall dashboard — overview of your wallpapers and activity.",
};

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <DashboardOverviewContent />
    </div>
  );
};

export default DashboardPage;
