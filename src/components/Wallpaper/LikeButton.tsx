"use client";

import { Button } from "@/components/shadcnui/button";
import { likeWallpaper } from "@/server/wallpaper/likeWallpaper";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type LikeButtonProps = {
  wallpaperId: string;
  initialLiked: boolean;
  initialLikesCount: number;
};

export const LikeButton = ({
  wallpaperId,
  initialLiked,
  initialLikesCount,
}: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      const result = await likeWallpaper(wallpaperId);

      if (result.success && result.data) {
        setLiked(result.data.liked);
        setLikesCount(result.data.likesCount);
        router.refresh();
      } else {
        if (result.error?.includes("logged in")) {
          toast.error("Please sign in to like wallpapers");
        } else {
          toast.error(result.error || "Failed to toggle like");
        }
      }
    } catch (error) {
      console.error("Like button error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2">
      <HeartIcon
        className={`h-4 w-4 ${liked ? "fill-current text-red-500" : ""}`}
      />
      <span>{likesCount}</span>
    </Button>
  );
};
