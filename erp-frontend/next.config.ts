import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/group/one/2",
  compiler: {
    styledComponents: true,
  },

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default nextConfig;