import { serverEnv } from "./env/serverEnv";

export const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (/^https?:\/\//.test(url) || url.startsWith("/")) return url;
  return `/api/images/${url.split("/").map(encodeURIComponent).join("/")}`;
};

export const extractS3Key = (url: string): string => {
  const proxyPrefix = "/api/images/";
  if (url.startsWith(proxyPrefix)) {
    return url.slice(proxyPrefix.length);
  }
  const publicUrl = serverEnv.S3_PUBLIC_URL;
  if (publicUrl) {
    const normalizedPublicUrl = publicUrl.replace(/\/+$/, "");
    if (url.startsWith(normalizedPublicUrl)) {
      return url.slice(normalizedPublicUrl.length).replace(/^\/+/, "");
    }
  }
  return url;
};
