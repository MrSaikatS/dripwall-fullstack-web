import type { NextConfig } from "next";
import "./app/env";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
