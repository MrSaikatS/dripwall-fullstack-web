"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/shadcnui/sidebar";
import { Grid3X3, Heart, LayoutDashboard, LogOut, User2 } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

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
  const { replace } = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const logoutHandler = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logout successful!");
        replace("/" as Route);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during logout";

      toast.error(errorMessage);
      console.error("Logout error:", err);
    }
  };

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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Profile"
              render={<Link href={"/dashboard/profile" as Route} />}
            >
              <User2 />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={logoutHandler}
              disabled={isLoggingOut}
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
