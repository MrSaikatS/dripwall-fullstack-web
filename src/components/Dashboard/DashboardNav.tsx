"use client";

import { Button } from "@/components/shadcnui/button";
import { Separator } from "@/components/shadcnui/separator";
import { Grid3X3, Heart, LayoutDashboard } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard" as const,
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/wallpapers" as const,
    label: "My Wallpapers",
    icon: Grid3X3,
  },
  {
    href: "/dashboard/likes" as const,
    label: "Liked Wallpapers",
    icon: Heart,
  },
];

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <h2 className="px-3 text-lg font-semibold">Dashboard</h2>
      <Separator />
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as Route}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
