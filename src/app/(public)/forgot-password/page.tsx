import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your DripWall account password.",
};

const ForgotPasswordPage = () => {
  return (
    <section className="flex min-h-dvh items-center justify-center px-4">
      <Card
        size="default"
        className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot password?</CardTitle>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Enter your email address to receive a password reset link.
          </p>
        </CardHeader>

        <CardContent>
          <ForgotPasswordForm />
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

export default ForgotPasswordPage;
