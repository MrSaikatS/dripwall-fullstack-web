import sharp from "sharp";

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
  fileSize: number;
};

export type ProcessedImage = {
  original: Buffer;
  thumbnail: Buffer;
  metadata: ImageMetadata;
};

/**
 * Processes an image buffer using Sharp:
 * - Extracts original metadata (dimensions, format, file size)
 * - Generates a WebP thumbnail (max 400px width, quality 80)
 *
 * @param buffer - Raw image buffer to process
 * @returns Original buffer, thumbnail buffer, and extracted metadata
 * @throws If Sharp processing fails
 */
export const processImage = async (buffer: Buffer): Promise<ProcessedImage> => {
  try {
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height || !metadata.format) {
      throw new Error("Failed to extract image metadata");
    }

    const fileSize = Buffer.byteLength(buffer);

    const thumbnail = await sharp(buffer)
      .resize({
        width: 400,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: 80 })
      .toBuffer();

    return {
      original: buffer,
      thumbnail,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        fileSize,
      },
    };
  } catch (error) {
    console.error("Image processing failed:", error);
    throw new Error(
      `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Validates that an image buffer meets the minimum requirements.
 * Ensures the buffer is non-empty and is a valid image.
 *
 * @param buffer - Image buffer to validate
 * @returns True if the buffer is valid
 * @throws If the buffer is empty or too large
 */
export const validateImageBuffer = (
  buffer: Buffer,
  maxSizeBytes: number = 50 * 1024 * 1024,
): boolean => {
  if (!buffer || buffer.length === 0) {
    throw new Error("Image buffer is empty");
  }

  if (buffer.length > maxSizeBytes) {
    throw new Error(
      `Image exceeds maximum size of ${maxSizeBytes / (1024 * 1024)}MB`,
    );
  }

  // Check for valid image headers (JPEG, PNG, WebP, GIF, AVIF, TIFF)
  const header = buffer.subarray(0, 12).toString("hex");

  const validHeaders = [
    "ffd8ff", // JPEG
    "89504e47", // PNG
    "52494646", // WebP (RIFF)
    "47494638", // GIF
    "0000001c66747970", // AVIF (ftyp)
    "0000002066747970", // AVIF (ftyp)
    "49492a00", // TIFF (little-endian)
    "4d4d002a", // TIFF (big-endian)
  ];

  const isValid = validHeaders.some((validHeader) =>
    header.startsWith(validHeader),
  );

  if (!isValid) {
    throw new Error("File is not a valid image format");
  }

  return true;
};
