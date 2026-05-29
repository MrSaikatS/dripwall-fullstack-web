import { ReactNode } from "react";

export type LayoutChildrenProps = Readonly<{
  children: ReactNode;
}>;

export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
