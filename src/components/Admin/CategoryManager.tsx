"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
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
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createForm = useForm<CategoryCreateFormType>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: { name: "", description: "" },
    mode: "all",
  });

  const editForm = useForm<CategoryCreateFormType>({
    resolver: zodResolver(categoryCreateSchema),
    mode: "all",
  });

  const startEdit = (cat: CategoryListItem) => {
    editForm.reset({ name: cat.name, description: cat.description ?? "" });
    setEditingId(cat.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    editForm.reset({ name: "", description: "" });
  };

  const onCreateSubmit = async (data: CategoryCreateFormType) => {
    const result = await createCategory(data);
    if (result.success) {
      toast.success("Category created!");
      createForm.reset();
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to create category");
    }
  };

  const onEditSubmit = async (data: CategoryCreateFormType) => {
    if (!editingId) return;
    const result = await updateCategory(editingId, {
      name: data.name,
      description: data.description || undefined,
    });
    if (result.success) {
      toast.success("Category updated!");
      setEditingId(null);
      editForm.reset();
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update category");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await deleteCategory(deleteTarget.id);
      if (result.success) {
        toast.success("Category deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete category");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Add New Category</h2>
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="grid gap-4"
          noValidate
        >
          <Controller
            name="name"
            control={createForm.control}
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
            control={createForm.control}
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

          <Button type="submit" disabled={createForm.formState.isSubmitting}>
            {createForm.formState.isSubmitting ? (
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
                {editingId === cat.id ? (
                  <form
                    onSubmit={editForm.handleSubmit(onEditSubmit)}
                    className="flex w-full flex-col gap-2"
                    noValidate
                  >
                    <Controller
                      name="name"
                      control={editForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Input
                            {...field}
                            id={`edit-name-${cat.id}`}
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
                      control={editForm.control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id={`edit-desc-${cat.id}`}
                          placeholder="Description"
                          autoComplete="off"
                        />
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={editForm.formState.isSubmitting}
                        aria-label={editForm.formState.isSubmitting ? "Saving" : "Save"}
                      >
                        {editForm.formState.isSubmitting ? (
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={cancelEdit}
                        aria-label="Cancel"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
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
                        aria-label={`Edit category ${cat.name}`}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Dialog
                        open={deleteTarget?.id === cat.id}
                        onOpenChange={(open) => {
                          if (!open) setDeleteTarget(null);
                        }}
                      >
                        <DialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteTarget({
                                  id: cat.id,
                                  name: cat.name,
                                })
                              }
                              aria-label={`Delete category ${cat.name}`}
                            >
                              <TrashIcon className="h-4 w-4 text-destructive" />
                            </Button>
                          }
                        />
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete
                              &ldquo;{cat.name}&rdquo;? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteTarget(null)}
                              disabled={isDeleting}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteConfirm}
                              disabled={isDeleting}
                            >
                              {isDeleting ?
                                <LoaderIcon className="h-4 w-4 animate-spin" />
                              : "Delete"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
