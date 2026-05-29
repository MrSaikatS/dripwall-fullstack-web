import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { serverEnv } from "./env/serverEnv";

let s3ClientInstance: S3Client | null = null;

/**
 * Returns a singleton S3Client instance configured for Backblaze B2.
 * Uses the S3-compatible endpoint and credentials from environment variables.
 */
const getS3Client = (): S3Client => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      endpoint: serverEnv.S3_ENDPOINT,
      region: serverEnv.S3_REGION,
      credentials: {
        accessKeyId: serverEnv.S3_ACCESS_KEY_ID,
        secretAccessKey: serverEnv.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
};

/**
 * Generates a file key for S3 storage.
 * Files are stored under `wallpapers/{userId}/{uuid}-{original-name}`
 * and thumbnails under `wallpapers/{userId}/thumb-{uuid}-{original-name}`.
 *
 * @param userId - The user's UUID
 * @param originalName - The original file name
 * @param isThumbnail - Whether this is a thumbnail variant
 * @returns The S3 object key
 */
export const generateFileKey = (
  userId: string,
  uuid: string,
  originalName: string,
  isThumbnail: boolean = false,
): string => {
  const prefix = isThumbnail ? "thumb-" : "";
  return `wallpapers/${userId}/${prefix}${uuid}-${originalName}`;
};

/**
 * Uploads a file buffer to S3-compatible storage.
 *
 * @param buffer - File buffer to upload
 * @param key - S3 object key (use generateFileKey to create)
 * @param contentType - MIME type of the file
 * @returns The public URL of the uploaded file
 * @throws If the upload fails
 */
export const uploadFile = async (
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> => {
  try {
    const client = getS3Client();

    const params: PutObjectCommandInput = {
      Bucket: serverEnv.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await client.send(command);

    // Return public URL if configured, otherwise return the S3 key
    if (serverEnv.S3_PUBLIC_URL) {
      return `${serverEnv.S3_PUBLIC_URL}/${key}`;
    }

    return key;
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw new Error(
      `Failed to upload file to storage: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Deletes a file from S3-compatible storage.
 *
 * @param key - S3 object key of the file to delete
 * @throws If the deletion fails
 */
export const deleteFile = async (key: string): Promise<void> => {
  try {
    const client = getS3Client();

    const command = new DeleteObjectCommand({
      Bucket: serverEnv.S3_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
  } catch (error) {
    console.error("S3 delete failed:", error);
    throw new Error(
      `Failed to delete file from storage: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Deletes both the original and thumbnail versions of a file.
 * Convenience method for cleaning up wallpaper assets.
 *
 * @param userId - The user's UUID
 * @param uuid - The unique identifier for the file
 * @param originalName - The original file name
 */
export const deleteWallpaperAssets = async (
  userId: string,
  uuid: string,
  originalName: string,
): Promise<void> => {
  const originalKey = generateFileKey(userId, uuid, originalName, false);
  const thumbnailKey = generateFileKey(userId, uuid, originalName, true);

  await Promise.all([deleteFile(originalKey), deleteFile(thumbnailKey)]);
};

/**
 * Generates a signed URL for secure download access to a private S3 object.
 * The URL expires after the specified duration (default: 60 minutes).
 *
 * @param key - S3 object key
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns A signed URL that provides temporary access to the file
 * @throws If signed URL generation fails
 */
export const getSignedUrl = async (
  key: string,
  expiresIn: number = 3600,
): Promise<string> => {
  try {
    const client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: serverEnv.S3_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await s3GetSignedUrl(client, command, {
      expiresIn,
    });

    return signedUrl;
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    throw new Error(
      `Failed to generate download URL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
