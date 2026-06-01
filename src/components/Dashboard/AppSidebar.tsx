"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/shadcnui/sidebar";
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

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="top-16! h-[calc(100vh-4rem)]!"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={"/dashboard" as Route} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <span className="font-semibold">DripWall</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href as Route} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarRail />
    </Sidebar>
  );
};
