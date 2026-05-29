"use client";

import { Button } from "@/components/shadcnui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  total: number;
};

export const Pagination = ({
  currentPage,
  totalPages,
  total,
}: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-center gap-4"
      aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() =>
          router.push(createPageUrl(currentPage - 1) as unknown as never)
        }>
        <ChevronLeftIcon className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
        <span className="ml-1">({total} total)</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() =>
          router.push(createPageUrl(currentPage + 1) as unknown as never)
        }>
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
};
