"use client";

import { Button } from "@/components/shadcnui/button";
import { Separator } from "@/components/shadcnui/separator";
import {
  Images,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin" as const, label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users" as const, label: "Users", icon: Users },
  { href: "/admin/wallpapers" as const, label: "Wallpapers", icon: Images },
  { href: "/admin/categories" as const, label: "Categories", icon: ShieldCheck },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <h2 className="px-3 text-lg font-semibold">Admin</h2>
      <Separator />
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href as Route}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
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
