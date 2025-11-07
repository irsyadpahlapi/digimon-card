import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://digi-api.com/images/**')],
  },
};

export default nextConfig;
