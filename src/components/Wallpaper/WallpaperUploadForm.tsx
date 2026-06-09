"use client";

import {
  type WallpaperUploadFormType,
  wallpaperUploadSchema,
} from "@/lib/zodSchema";
import { createWallpaper } from "@/server/wallpaper/createWallpaper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useFilePicker } from "use-file-picker";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../shadcnui/select";
import { Textarea } from "../shadcnui/textarea";

type CategoryOption = {
  id: string;
  name: string;
};

type WallpaperUploadFormProps = {
  categories: CategoryOption[];
};

const WallpaperUploadForm = ({ categories }: WallpaperUploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const { replace } = useRouter();

  const { handleSubmit, control, reset } = useForm<WallpaperUploadFormType>({
    resolver: zodResolver(wallpaperUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
    },
    mode: "all",
  });

  const { openFilePicker, plainFiles, filesContent, clear } = useFilePicker({
    readAs: "DataURL",
    accept: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tiff"],
    multiple: false,
    maxFileSize: 10,
    onFilesSuccessfullySelected: () => setIsFile(true),
    onClear: () => setIsFile(false),
  });

  const uploadFormHandler = async (formData: WallpaperUploadFormType) => {
    if (plainFiles.length === 0) {
      toast.error("Please select an image file");
      return;
    }

    setIsSubmitting(true);

    try {
      const file = plainFiles[0];

      if (!file) {
        toast.error("No file selected");
        setIsSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("title", formData.title);
      if (formData.description) {
        fd.append("description", formData.description);
      }
      fd.append("categoryId", formData.categoryId);
      fd.append("file", file);

      const result = await createWallpaper(fd);

      if (result.success) {
        toast.success("Wallpaper uploaded successfully!");
        reset();
        clear();
        replace("/");
      } else {
        toast.error(result.error ?? "Failed to upload wallpaper");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload wallpaper";

      toast.error(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(uploadFormHandler)}
      className="mx-auto grid max-w-2xl gap-6"
      noValidate>
      {/* File Picker */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Image</p>

        {!isFile ?
          <div
            onClick={() => openFilePicker()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                openFilePicker();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Select an image file"
            className="hover:border-primary flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors">
            <UploadIcon className="text-muted-foreground size-8" />

            <p className="text-muted-foreground text-sm">
              Click to select an image (JPEG, PNG, WebP, GIF, AVIF, TIFF)
            </p>

            <p className="text-muted-foreground text-xs">Max file size: 10MB</p>
          </div>
        : <div className="relative aspect-video w-full">
            {filesContent.map((file, idx) => (
              <Image
                key={idx}
                src={file.content}
                alt={file.name}
                fill
                unoptimized
                className="rounded-lg object-cover"
              />
            ))}

            <button
              type="button"
              onClick={() => clear()}
              className="bg-background/80 hover:bg-background absolute top-2 right-2 rounded-full p-1.5 transition-colors"
              aria-label="Remove selected file">
              <XIcon className="size-4" />
            </button>
          </div>
        }
      </div>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>

            <Input
              {...field}
              id={field.name}
              type="text"
              aria-invalid={fieldState.invalid}
              placeholder="Enter wallpaper title"
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
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>

            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter a description (optional)"
              rows={4}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Category */}
      <Controller
        name="categoryId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Category</FieldLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
              aria-invalid={fieldState.invalid}>
              <SelectTrigger className="w-full">
                <span data-slot="select-value">
                  {categories.find((cat) => cat.id === field.value)?.name ||
                    "Select a category"}
                </span>
              </SelectTrigger>

              <SelectContent>
                {categories.length === 0 ?
                  <SelectItem
                    value=""
                    disabled>
                    No categories available
                  </SelectItem>
                : categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || plainFiles.length === 0}
        className="w-full">
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" /> Uploading..
          </>
        : <>
            <UploadIcon /> Upload Wallpaper
          </>
        }
      </Button>
    </form>
  );
};

export default WallpaperUploadForm;
