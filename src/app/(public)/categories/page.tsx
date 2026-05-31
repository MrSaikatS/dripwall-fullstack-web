import { CategoryGrid } from "@/components/Category/CategoryGrid";
import { Separator } from "@/components/shadcnui/separator";
import { getCategories } from "@/server/category/getCategories";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Browse wallpapers by category
        </p>
      </div>

      <Separator />

      <CategoryGrid categories={categories} />
    </div>
  );
};

export default CategoriesPage;
