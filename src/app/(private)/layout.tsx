import { auth } from "@/lib/auth";
import { LayoutChildrenProps } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const PrivateLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
};

export default PrivateLayout;
