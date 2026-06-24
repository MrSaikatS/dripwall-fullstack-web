"use client";

import { Grid3X3, Heart, LayoutDashboard, UserIcon } from "lucide-react";
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
    label: "Wallpapers",
    icon: Grid3X3,
  },
  {
    href: "/dashboard/likes" as const,
    label: "Likes",
    icon: Heart,
  },
  {
    href: "/dashboard/profile" as const,
    label: "Profile",
    icon: UserIcon,
  },
];

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background fixed inset-x-0 bottom-0 z-40 border-t md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors ${
                isActive ?
                  "text-foreground border-foreground border-t-2"
                : "text-muted-foreground hover:text-foreground"
              }`}>
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
