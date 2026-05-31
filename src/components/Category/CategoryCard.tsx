"use client";

import { Badge } from "@/components/shadcnui/badge";
import { Card } from "@/components/shadcnui/card";
import type { CategoryListItem } from "@/server/category/getCategories";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  category: CategoryListItem;
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-muted relative flex aspect-video items-center justify-center">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <ImageIcon className="text-muted-foreground size-12" />
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">{category.name}</p>
            {category.description && (
              <p className="text-muted-foreground mt-1 truncate text-sm">
                {category.description}
              </p>
            )}
          </div>
          <Badge variant="secondary" className="ml-3 shrink-0">
            {category._count.wallpapers}
          </Badge>
        </div>
      </Card>
    </Link>
  );
};
