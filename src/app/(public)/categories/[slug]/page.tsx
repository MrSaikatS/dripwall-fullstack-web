import { CategoryWallpapersContent } from "@/components/Category/CategoryWallpapersContent";
import { Separator } from "@/components/shadcnui/separator";
import type { PageParams } from "@/lib/types";
import { getCategoryBySlug } from "@/server/category/getCategoryBySlug";
import { notFound } from "next/navigation";

type CategoryDetailPageProps = PageParams<{ slug: string }> & {
  searchParams: Promise<{ page?: string }>;
};

const CategoryDetailPage = async ({
  params,
  searchParams,
}: CategoryDetailPageProps) => {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const result = await getCategoryBySlug(slug, page);

  if (!result.category) {
    notFound();
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">{result.category.name}</h1>
        {result.category.description && (
          <p className="text-muted-foreground mt-2">
            {result.category.description}
          </p>
        )}
      </div>

      <Separator />

      <CategoryWallpapersContent
        category={result.category}
        initialData={result.wallpapers}
      />
    </div>
  );
};

export default CategoryDetailPage;
