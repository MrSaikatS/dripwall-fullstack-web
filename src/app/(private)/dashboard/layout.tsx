import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { MobileNav } from "@/components/Dashboard/MobileNav";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcnui/sidebar";
import { Separator } from "@/components/shadcnui/separator";
import type { LayoutChildrenProps } from "@/lib/types";

const DashboardLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <div
      style={{
        width: "100dvw",
        marginLeft: "calc(-1 * (100dvw - 100%) / 2)",
        marginRight: "calc(-1 * (100dvw - 100%) / 2)",
      }}
    >
      <SidebarProvider>
        <AppSidebar />
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

export default DashboardLayout;
