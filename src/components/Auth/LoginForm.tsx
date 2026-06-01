"use client";

import { authClient } from "@/lib/auth-client";
import { loginFormSchema, LoginFormType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";

const isSafeRedirect = (dest: string): boolean =>
  dest.startsWith("/") && !dest.startsWith("//") && !dest.includes("://") && !dest.includes("@");

const LoginForm = ({ returnTo }: { returnTo?: string }) => {
  const { replace } = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "all",
  });

  const loginFormHandler = async ({
    email,
    password,
    rememberMe,
  }: LoginFormType) => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        console.error(error);
        toast.error("Login failed. Please try again.");
      } else {
        toast.success("Login successful!");

        reset();

        replace((returnTo && isSafeRedirect(returnTo) ? returnTo : "/") as Route);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(loginFormHandler)}
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

      {/* Password field */}
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex items-center justify-between">
        {/* Remember Me checkbox */}
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="border-border bg-background text-primary accent-primary size-4 rounded"
              />
              Remember me
            </label>
          )}
        />

        {/* Forgot password link */}
        <Link
          href="/forgot-password"
          className="text-primary font-medium underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={isSubmitting || !isValid}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" /> Logging in ..
          </>
        : <>
            <LockIcon /> Login
          </>
        }
      </Button>
    </form>
  );
};

export default LoginForm;
