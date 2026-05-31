import { getCategories } from "@/server/category/getCategories";
import { CategoryManager } from "./CategoryManager";

const AdminCategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and delete categories
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
};

export default AdminCategoriesPage;
