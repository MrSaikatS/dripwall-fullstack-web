"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import type { Route } from "next";
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
import {
  BookmarkIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogOutIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react";

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
      className="fixed top-0 z-50 w-dvw border-b shadow"
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
              <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 ring-1 ring-border transition-all hover:ring-foreground/30">
                <Avatar size="sm">
                  <AvatarFallback>
                    {data.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {data.user.name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {data.user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => push("/dashboard" as Route)}>
                    <LayoutDashboardIcon /> Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => push("/upload" as Route)}>
                    <UploadIcon /> Upload
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => push("/collections" as Route)}>
                    <BookmarkIcon /> Collections
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => push("/admin" as Route)}>
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
                  : <LogOutIcon />
                  }
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          : <div className="flex items-center gap-2">
              <Link href={"/login" as Route}>
                <Button variant="ghost" size="sm">
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
