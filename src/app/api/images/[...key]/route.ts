import { getS3Client } from "@/lib/fileStorage";
import { serverEnv } from "@/lib/env/serverEnv";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) => {
  try {
    const { key } = await params;
    const s3Key = key.join("/");

    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: serverEnv.S3_BUCKET_NAME,
      Key: s3Key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const arrayBuffer = await response.Body.transformToByteArray();
    const contentType = response.ContentType || "image/webp";
    const body = Buffer.from(arrayBuffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Not Found", { status: 404 });
  }
};
