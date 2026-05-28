import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | DripWall",
  description: "Create a new password for your DripWall account.",
};

const ResetPasswordPage = () => {
  return (
    <section className="flex min-h-dvh items-center justify-center px-4">
      <Card
        size="default"
        className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Enter your new password below.
          </p>
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="text-muted-foreground text-center text-sm">
                Loading...
              </div>
            }>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>

        <div className="text-muted-foreground border-t px-4 py-4 text-center text-sm">
          <Link
            href="/login"
            className="text-primary font-medium underline-offset-4 hover:underline">
            Back to login
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default ResetPasswordPage;
