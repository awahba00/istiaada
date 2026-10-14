import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // C2 — the silent TypeScript escape hatch is gone: `next build` now
  // validates the application source (tsconfig.json scopes the check to
  // src/ + Next-generated types; development scripts have their own
  // tsconfig.scripts.json). A type error in shipped code fails the build.
  reactStrictMode: false,
};

export default nextConfig;
