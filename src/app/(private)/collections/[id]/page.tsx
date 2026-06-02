import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { PageParams } from "@/lib/types";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CollectionDetailContent } from "@/components/Collection/CollectionDetailContent";

export async function generateMetadata({
  params,
}: PageParams<{ id: string }>): Promise<Metadata> {
  const { id } = await params;
  const collection = await prisma.collection.findUnique({
    where: { id },
    select: { name: true, description: true },
  });

  if (!collection) return {};

  return {
    title: collection.name,
    description: collection.description ?? undefined,
  };
}

const CollectionDetailPage = async ({ params }: PageParams<{ id: string }>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <CollectionDetailContent
        collectionId={id}
        userId={session.user.id}
      />
    </div>
  );
};

export default CollectionDetailPage;
