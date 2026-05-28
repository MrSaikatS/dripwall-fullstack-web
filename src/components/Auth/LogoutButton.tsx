"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";

const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();

  const { replace } = useRouter();

  const logoutHandler = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logout successful!");

        replace("/");
      }
    } catch (err) {
      // Handle thrown exceptions (e.g., network/fetch rejections)
      const errorMessage =
        err instanceof Error ?
          err.message
        : "An unexpected error occurred during logout";

      toast.error(errorMessage);

      console.error("Logout error:", err);
    }
  };

  return (
    <Button
      type="button"
      onClick={() => startTransition(logoutHandler)}
      disabled={isPending}
      variant={"destructive"}
      className="w-full">
      {isPending ?
        <>
          <Loader2Icon className="animate-spin" /> Logging out
        </>
      : <>
          <LogOutIcon /> Logout
        </>
      }
    </Button>
  );
};

export default LogoutButton;
