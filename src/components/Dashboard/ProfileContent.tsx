"use client";

import {
  changePasswordSchema,
  profileNameSchema,
  type ChangePasswordFormType,
  type ProfileNameFormType,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/shadcnui/button";
import { Card } from "@/components/shadcnui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
import { Field } from "@/components/shadcnui/field";
import { FieldError } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Label } from "@/components/shadcnui/label";
import { Separator } from "@/components/shadcnui/separator";
import { Skeleton } from "@/components/shadcnui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import { authClient } from "@/lib/auth-client";
import { uploadAvatar } from "@/server/user/uploadAvatar";
import { CameraIcon, Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Route } from "next";

export const ProfileContent = () => {
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const { push } = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const nameForm = useForm<ProfileNameFormType>({
    resolver: zodResolver(profileNameSchema),
    mode: "all",
    values: { name: session?.user?.name ?? "" },
  });

  const passwordForm = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    mode: "all",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarPreviewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onNameSubmit = async (data: ProfileNameFormType) => {
    try {
      const { error } = await authClient.updateUser({ name: data.name });

      if (error) {
        toast.error(error.message ?? "Failed to update name");
      } else {
        toast.success("Name updated successfully");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";

      toast.error(message);
      console.error("Update name error:", err);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormType) => {
    try {
      const { error } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message ?? "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        passwordForm.reset();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";

      toast.error(message);
      console.error("Change password error:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreviewRef.current) {
        URL.revokeObjectURL(avatarPreviewRef.current);
      }
    };
  }, []);

  const onDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();

      if (error) {
        toast.error(error.message ?? "Failed to delete account");
      } else {
        toast.success("Account deleted successfully");
        push("/" as Route);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";

      toast.error(message);
      console.error("Delete account error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (avatarPreviewRef.current) {
        URL.revokeObjectURL(avatarPreviewRef.current);
      }
      const url = URL.createObjectURL(file);
      avatarPreviewRef.current = url;
      setAvatarPreview(url);
    }
  };

  const onAvatarUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("avatar", file);

      const result = await uploadAvatar(formData);

      if (result.success) {
        toast.success("Profile picture updated");
        if (avatarPreviewRef.current) {
          URL.revokeObjectURL(avatarPreviewRef.current);
          avatarPreviewRef.current = null;
        }
        setAvatarPreview(null);
        await refetch();

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.error ?? "Failed to upload avatar");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";

      toast.error(message);
      console.error("Upload avatar error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full max-w-2xl" />
        <Skeleton className="h-48 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and account settings.
        </p>
      </div>

      <Separator />

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar size="lg">
            {avatarPreview ?
              <AvatarImage src={avatarPreview} />
            : session?.user?.image ?
              <AvatarImage src={session.user.image} />
            : null}
            <AvatarFallback>
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">Profile Picture</p>
            <p className="text-muted-foreground text-sm">
              JPEG, PNG, WebP, GIF or AVIF. Max 5MB.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <CameraIcon />
            {avatarPreview ? "Choose Different" : "Change Photo"}
          </Button>

          {avatarPreview && (
            <Button
              onClick={onAvatarUpload}
              disabled={isUploading}
            >
              {isUploading ?
                <Loader2Icon className="animate-spin" />
              : "Save Photo"}
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <PencilIcon className="text-muted-foreground h-5 w-5" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>

        <div className="mb-4 space-y-1">
          <p className="text-muted-foreground text-sm">Email</p>
          <p className="font-medium">{session?.user?.email}</p>
        </div>

        <form
          onSubmit={nameForm.handleSubmit(onNameSubmit)}
          noValidate
          className="space-y-4"
        >
          <Field data-invalid={!!nameForm.formState.errors.name}>
            <Label htmlFor="name">Name</Label>
            <Controller
              name="name"
              control={nameForm.control}
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="Your name"
                  autoComplete="name"
                  {...field}
                />
              )}
            />
            <FieldError role="alert">
              {nameForm.formState.errors.name?.message}
            </FieldError>
          </Field>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={nameForm.formState.isSubmitting}
            >
              {nameForm.formState.isSubmitting ?
                <Loader2Icon className="animate-spin" />
              : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <PencilIcon className="text-muted-foreground h-5 w-5" />
          <h2 className="text-xl font-semibold">Change Password</h2>
        </div>

        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          noValidate
          className="space-y-4"
        >
          <Field data-invalid={!!passwordForm.formState.errors.currentPassword}>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Controller
              name="currentPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  {...field}
                />
              )}
            />
            <FieldError role="alert">
              {passwordForm.formState.errors.currentPassword?.message}
            </FieldError>
          </Field>

          <Field data-invalid={!!passwordForm.formState.errors.newPassword}>
            <Label htmlFor="newPassword">New Password</Label>
            <Controller
              name="newPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  {...field}
                />
              )}
            />
            <FieldError role="alert">
              {passwordForm.formState.errors.newPassword?.message}
            </FieldError>
          </Field>

          <Field data-invalid={!!passwordForm.formState.errors.confirmPassword}>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Controller
              name="confirmPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  {...field}
                />
              )}
            />
            <FieldError role="alert">
              {passwordForm.formState.errors.confirmPassword?.message}
            </FieldError>
          </Field>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ?
                <Loader2Icon className="animate-spin" />
              : "Change Password"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border-destructive/50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Trash2Icon className="text-destructive h-5 w-5" />
          <h2 className="text-xl font-semibold text-destructive">
            Danger Zone
          </h2>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">
          Once you delete your account, there is no going back. All your
          wallpapers, collections, and data will be permanently removed.
        </p>

        <div className="flex justify-end">
          <Dialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <DialogTrigger
              render={
                <Button variant="destructive">
                  <Trash2Icon />
                  Delete Account
                </Button>
              }
            />

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All your data including
                  wallpapers, collections, and likes will be permanently
                  deleted.
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ?
                    <Loader2Icon className="animate-spin" />
                  : "Delete My Account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
};
