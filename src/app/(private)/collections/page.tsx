import { Separator } from "@/components/shadcnui/separator";
import type { Metadata } from "next";
import { CollectionsPageContent } from "./CollectionsPageContent";

export const metadata: Metadata = {
  title: "Collections",
  description: "Organize your favorite wallpapers into collections.",
};

const CollectionsPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Collections</h1>
        <p className="text-muted-foreground mt-2">
          Organize your favorite wallpapers into collections
        </p>
      </div>

      <Separator />

      <CollectionsPageContent />
    </div>
  );
};

export default CollectionsPage;
