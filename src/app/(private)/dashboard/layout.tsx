import { DashboardNav } from "@/components/Dashboard/DashboardNav";
import { Separator } from "@/components/shadcnui/separator";
import type { LayoutChildrenProps } from "@/lib/types";

const DashboardLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r p-4 md:block">
        <DashboardNav />
      </aside>

      {/* Mobile nav */}
      <div className="border-b p-4 md:hidden">
        <DashboardNav />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Separator className="mb-6 md:hidden" />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
