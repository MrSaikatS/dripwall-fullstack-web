import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnui/card";
import { getAdminStats } from "@/server/admin/getAdminStats";
import type { Metadata } from "next";
import {
  DownloadIcon,
  Grid3X3Icon,
  LayersIcon,
  UsersIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "DripWall admin panel.",
};

const statCards = [
  { label: "Total Users", key: "totalUsers", icon: UsersIcon },
  { label: "Total Wallpapers", key: "totalWallpapers", icon: Grid3X3Icon },
  { label: "Total Categories", key: "totalCategories", icon: LayersIcon },
  { label: "Total Downloads", key: "totalDownloads", icon: DownloadIcon },
] as const;

const AdminOverviewPage = async () => {
  const stats = await getAdminStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Failed to load stats
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the admin panel
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats[card.key as keyof typeof stats]}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
