"use client";

import { Button } from "@/components/shadcnui/button";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import type { CollectionCreateFormType } from "@/lib/zodSchema";
import { collectionCreateSchema } from "@/lib/zodSchema";
import { createCollection } from "@/server/collection/createCollection";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CollectionFormProps = {
  onSuccess?: () => void;
};

export const CollectionForm = ({ onSuccess }: CollectionFormProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CollectionCreateFormType>({
    resolver: zodResolver(collectionCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
    },
    mode: "all",
  });

  const onSubmit = async (data: CollectionCreateFormType) => {
    const result = await createCollection(data);

    if (result.success) {
      toast.success("Collection created!");
      reset();
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to create collection");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
      noValidate>
      {/* Name */}
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
              placeholder="My Collection"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description (optional)</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="A short description..."
              rows={3}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Visibility */}
      <Controller
        name="isPublic"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="border-border bg-background text-primary accent-primary h-4 w-4 rounded"
            />
            Make this collection public
          </label>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <LoaderIcon className="animate-spin" /> Creating...
          </>
        : <>
            <PlusIcon /> Create Collection
          </>
        }
      </Button>
    </form>
  );
};
