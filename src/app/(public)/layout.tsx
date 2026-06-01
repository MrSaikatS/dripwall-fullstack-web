import type { LayoutChildrenProps } from "@/lib/types";

const PublicLayout = ({ children }: LayoutChildrenProps) => {
  return <div className="mx-auto max-w-7xl">{children}</div>;
};

export default PublicLayout;
