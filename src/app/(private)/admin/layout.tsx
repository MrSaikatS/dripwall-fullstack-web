import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { auth } from "@/lib/auth";
import { Separator } from "@/components/shadcnui/separator";
import type { LayoutChildrenProps } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-64 shrink-0 border-r p-4 md:block">
        <AdminSidebar />
      </aside>

      <div className="border-b p-4 md:hidden">
        <AdminSidebar />
      </div>

      <main className="flex-1 p-6">
        <Separator className="mb-6 md:hidden" />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
