"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Skeleton } from "../shadcnui/skeleton";
import LogoutButton from "./LogoutButton";

const AuthHeader = () => {
  const { data, isPending, isRefetching } = authClient.useSession();

  if (isPending || isRefetching) {
    return <Skeleton className="h-8 w-36" />;
  }

  if (data) {
    return <LogoutButton />;
  }

  return (
    <>
      <Link
        href="/login"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
        Sign in
      </Link>

      <Link
        href="/register"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
        Sign up
      </Link>
    </>
  );
};

export default AuthHeader;
