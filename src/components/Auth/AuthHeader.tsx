import Link from "next/link";
import type { Route } from "next";

const AuthHeader = () => {
  return (
    <>
      <Link
        href={"/login" as Route}
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
        Sign in
      </Link>

      <Link
        href={"/register" as Route}
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
        Sign up
      </Link>
    </>
  );
};

export default AuthHeader;
