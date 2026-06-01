import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { MobileNav } from "@/components/Admin/MobileNav";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcnui/sidebar";
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
    <div
      style={{
        width: "100dvw",
        marginLeft: "calc(-1 * (100dvw - 100%) / 2)",
        marginRight: "calc(-1 * (100dvw - 100%) / 2)",
      }}
    >
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="max-md:text-foreground" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <div className="flex-1 p-6 pb-20 md:pb-6">{children}</div>
        </div>
        <MobileNav />
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
