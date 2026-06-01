import { serverEnv } from "./env/serverEnv";

export const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (/^https?:\/\//.test(url) || url.startsWith("/")) return url;
  return `/api/images/${url}`;
};

export const extractS3Key = (url: string): string => {
  const proxyPrefix = "/api/images/";
  if (url.startsWith(proxyPrefix)) {
    return url.slice(proxyPrefix.length);
  }
  const publicUrl = serverEnv.S3_PUBLIC_URL;
  if (publicUrl && url.startsWith(publicUrl)) {
    return url.slice(publicUrl.length + 1);
  }
  return url;
};
