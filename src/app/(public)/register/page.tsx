import RegisterForm from "@/components/Auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | DripWall",
  description:
    "Create a DripWall account to start collecting and sharing wallpapers.",
};

const RegisterPage = () => {
  return (
    <section className="flex min-h-dvh items-center justify-center px-4">
      <Card
        size="default"
        className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join DripWall and start exploring beautiful wallpapers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>

        <div className="text-muted-foreground border-t px-4 py-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default RegisterPage;
