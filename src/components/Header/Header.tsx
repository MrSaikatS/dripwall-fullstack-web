"use client";

import { authClient } from "@/lib/auth-client";
import {
  ChevronDownIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogOutIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import { Avatar, AvatarFallback } from "../shadcnui/avatar";
import { Button } from "../shadcnui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcnui/dropdown-menu";
import { Skeleton } from "../shadcnui/skeleton";

const Header = () => {
  const { data, isPending } = authClient.useSession();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const { replace, push } = useRouter();

  const isAdmin = data?.user?.role === "admin";

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
        err instanceof Error ?
          err.message
        : "An unexpected error occurred during logout";

      toast.error(errorMessage);

      console.error("Logout error:", err);
    }
  };

  return (
    <header
      className="border-border/40 bg-background/80 fixed top-0 z-50 w-dvw border-b backdrop-blur-sm"
      aria-label="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href={"/" as Route}>
            <h1 className="text-2xl font-semibold">DripWall</h1>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href={"/wallpapers" as Route}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              Wallpapers
            </Link>

            <Link
              href={"/categories" as Route}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              Categories
            </Link>

            {data && (
              <>
                <Link
                  href={"/upload" as Route}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                  Upload
                </Link>

                <Link
                  href={"/collections" as Route}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                  Collections
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isPending ?
            <Skeleton className="h-8 w-8 rounded-full" />
          : data ?
            <DropdownMenu>
              <DropdownMenuTrigger className="ring-border hover:ring-foreground/30 flex cursor-pointer items-center gap-1 rounded-full p-0.5 pr-2 ring-1 transition-all">
                <Avatar size="sm">
                  <AvatarFallback>
                    {data.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDownIcon className="text-muted-foreground h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {data.user.name}
                      </span>

                      <span className="text-muted-foreground text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => push("/dashboard" as Route)}>
                    <LayoutDashboardIcon /> Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => push("/dashboard/wallpapers" as Route)}>
                    <UserIcon /> My Wallpapers
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => push("/admin" as Route)}>
                        <ShieldIcon /> Admin
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => startLogoutTransition(logoutHandler)}
                  disabled={isLoggingOut}>
                  {isLoggingOut ?
                    <Loader2Icon className="animate-spin" />
                  : <LogOutIcon />}
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          : <div className="flex items-center gap-2">
              <Link href={"/login" as Route}>
                <Button
                  variant="ghost"
                  size="sm">
                  Sign in
                </Button>
              </Link>

              <Link href={"/register" as Route}>
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          }

          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
