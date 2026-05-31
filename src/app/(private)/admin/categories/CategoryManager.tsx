"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import type { CategoryCreateFormType } from "@/lib/zodSchema";
import { categoryCreateSchema } from "@/lib/zodSchema";
import { createCategory } from "@/server/admin/createCategory";
import { deleteCategory } from "@/server/admin/deleteCategory";
import { updateCategory } from "@/server/admin/updateCategory";
import type { CategoryListItem } from "@/server/category/getCategories";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditIcon,
  LoaderIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CategoryManagerProps = {
  categories: CategoryListItem[];
};

export const CategoryManager = ({ categories }: CategoryManagerProps) => {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryCreateFormType>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: { name: "", description: "" },
    mode: "all",
  });

  const [editForm, setEditForm] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const onCreateSubmit = async (data: CategoryCreateFormType) => {
    const result = await createCategory(data);
    if (result.success) {
      toast.success("Category created!");
      reset();
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to create category");
    }
  };

  const startEdit = (cat: CategoryListItem) => {
    setEditForm({
      id: cat.id,
      name: cat.name,
      description: cat.description ?? "",
    });
    setEditingId(cat.id);
  };

  const cancelEdit = () => {
    setEditForm(null);
    setEditingId(null);
  };

  const handleUpdateSubmit = async () => {
    if (!editForm) return;
    const result = await updateCategory(editForm.id, {
      name: editForm.name,
      description: editForm.description || undefined,
    });
    if (result.success) {
      toast.success("Category updated!");
      setEditForm(null);
      setEditingId(null);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeletingId(id);
    const result = await deleteCategory(id);
    if (result.success) {
      toast.success("Category deleted");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete category");
    }
    setDeletingId(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Add New Category</h2>
        <form
          onSubmit={handleSubmit(onCreateSubmit)}
          className="grid gap-4"
          noValidate
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Category name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Optional description"
                  autoComplete="off"
                />
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderIcon className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <PlusIcon /> Create Category
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories yet</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                {editingId === cat.id && editForm ? (
                  <div className="flex w-full flex-col gap-2">
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Name"
                    />
                    <Textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdateSubmit}
                        disabled={!editForm.name.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.description ?? "No description"}
                        {" · "}
                        {cat._count.wallpapers} wallpaper(s)
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(cat)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      {deletingId === cat.id ? (
                        <Button variant="ghost" size="sm" disabled>
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cat.id, cat.name)}
                        >
                          <TrashIcon className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
