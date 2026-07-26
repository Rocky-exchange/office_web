import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
