import LoginForm from "@/components/Auth/LoginForm";
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
  title: "Login",
  description:
    "Sign in to your DripWall account to access your wallpapers and collections.",
};

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) => {
  const { returnTo } = await searchParams;

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4">
      <Card
        size="default"
        className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your DripWall account to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm returnTo={returnTo} />
        </CardContent>

        <div className="text-muted-foreground border-t px-4 py-4 text-center text-sm">
          {"No account yet? "}
          <Link
            href="/register"
            className="text-primary font-medium underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default LoginPage;
