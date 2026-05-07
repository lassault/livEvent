import type { NextConfig } from "next";
import path from "path";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages demo build
  ...(isGithubPages && {
    output: "export",
    basePath: "/livEvent",
    trailingSlash: true,
  }),
  images: {
    // GitHub Pages cannot use Next.js image optimisation (no server)
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Ensure Turbopack resolves from the repo root, not a subdirectory
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
