import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { getS3Client } from "@/lib/fileStorage";
import { serverEnv } from "@/lib/env/serverEnv";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export const runtime = "nodejs";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) => {
  try {
    const { key } = await params;
    const s3Key = key.join("/");

    let isPublic = false;

    if (s3Key.startsWith("avatars/")) {
      isPublic = true;
    } else {
      const encodedS3Key = s3Key.split("/").map(encodeURIComponent).join("/");

      const possibleImageUrls = [
        s3Key,
        encodedS3Key,
        `/api/images/${s3Key}`,
        `/api/images/${encodedS3Key}`,
      ];

      if (serverEnv.S3_PUBLIC_URL) {
        const trimmed = serverEnv.S3_PUBLIC_URL.replace(/\/+$/, "");
        possibleImageUrls.push(
          `${trimmed}/${s3Key}`,
          `${trimmed}//${s3Key}`,
          `${trimmed}/${encodedS3Key}`,
          `${trimmed}//${encodedS3Key}`,
        );
      }

      const wallpaper = await prisma.wallpaper.findFirst({
        where: {
          OR: [
            { imageUrl: { in: possibleImageUrls } },
            { thumbnailUrl: { in: possibleImageUrls } },
          ],
        },
        select: { isPublic: true, userId: true },
      });

      if (!wallpaper) {
        return new NextResponse("Not Found", { status: 404 });
      }

      isPublic = wallpaper.isPublic;

      if (!isPublic) {
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        if (!session?.user?.id || session.user.id !== wallpaper.userId) {
          return new NextResponse("Forbidden", { status: 403 });
        }
      }
    }

    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: serverEnv.S3_BUCKET_NAME,
      Key: s3Key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const contentType = response.ContentType || "image/webp";

    let stream: ReadableStream;
    if (response.Body instanceof Readable) {
      stream = Readable.toWeb(response.Body) as ReadableStream;
    } else if (response.Body instanceof Blob) {
      stream = response.Body.stream();
    } else {
      stream = response.Body;
    }

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          isPublic ?
            "public, max-age=31536000, immutable"
          : "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    if (
      error instanceof Error &&
      (error.name === "NoSuchKey" || error.name === "NotFound")
    ) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
