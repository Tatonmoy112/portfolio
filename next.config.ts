import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Keep disabled for local dev so API routes work!
  trailingSlash: true,
  basePath: '/portfolio',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
