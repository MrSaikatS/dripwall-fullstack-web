import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn: typeof clsx = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
