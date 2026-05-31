import { auth } from "@/lib/auth";
import type { PageParams } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CollectionDetailContent } from "./CollectionDetailContent";

const CollectionDetailPage = async ({ params }: PageParams<{ id: string }>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <div className="space-y-8 p-6">
      <CollectionDetailContent
        collectionId={id}
        userId={session.user.id}
      />
    </div>
  );
};

export default CollectionDetailPage;
