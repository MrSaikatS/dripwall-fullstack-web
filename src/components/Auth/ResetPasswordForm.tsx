"use client";

import { authClient } from "@/lib/auth-client";
import {
  resetPasswordFormSchema,
  ResetPasswordFormType,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, LockIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";

const ResetPasswordForm = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const resetPasswordHandler = async ({
    newPassword,
  }: ResetPasswordFormType) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        console.error(error);
        if (
          error.message?.includes("token") ||
          error.message?.includes("expired")
        ) {
          toast.error(
            "Reset link is invalid or expired. Please request a new one.",
          );
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      } else {
        toast.success(
          "Password reset successful! You can now log in with your new password.",
        );

        reset();

        replace("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="text-muted-foreground text-center text-sm">
        Invalid or missing reset link. Please request a new password reset.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(resetPasswordHandler)}
      className="grid gap-6"
      noValidate>
      {/* New Password field */}
      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Confirm Password field */}
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        className="w-full"
        type="submit"
        disabled={isSubmitting || !isValid}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" /> Resetting password ..
          </>
        : <>
            <LockIcon /> Reset Password
          </>
        }
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
