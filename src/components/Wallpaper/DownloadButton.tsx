"use client";

import { Button } from "@/components/shadcnui/button";
import { downloadWallpaper } from "@/server/wallpaper/downloadWallpaper";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type DownloadButtonProps = {
  wallpaperId: string;
  downloadCount: number;
};

export const DownloadButton = ({
  wallpaperId,
  downloadCount,
}: DownloadButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      const result = await downloadWallpaper(wallpaperId);

      if (result.success && result.data) {
        // Trigger the download via an anchor tag
        const anchor = document.createElement("a");
        anchor.href = result.data.signedUrl;
        anchor.download = result.data.title || "wallpaper";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        toast.success("Download started!");
      } else {
        toast.error(result.error || "Failed to download");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleDownload}
      disabled={isPending}
      className="gap-2">
      <DownloadIcon className="h-4 w-4" />
      <span>{downloadCount}</span>
    </Button>
  );
};
