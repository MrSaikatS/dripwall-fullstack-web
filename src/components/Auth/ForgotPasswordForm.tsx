"use client";

import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormType,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, MailIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";

const ForgotPasswordForm = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const forgotPasswordHandler = async ({ email }: ForgotPasswordFormType) => {
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error(error);
        toast.error("Failed to send reset email. Please try again.");
      } else {
        toast.success(
          "If this email exists in our system, you will receive a reset link.",
        );

        reset();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(forgotPasswordHandler)}
      className="grid gap-6"
      noValidate>
      {/* Email field */}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your email"
              autoComplete="email"
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
            <Loader2Icon className="animate-spin" /> Sending reset link ..
          </>
        : <>
            <MailIcon /> Send Reset Link
          </>
        }
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
