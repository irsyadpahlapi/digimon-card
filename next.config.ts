import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://digi-api.com/images/**'),
      new URL('https://images.digimoncard.io/images/cards/**'),
    ],
  },
};

export default nextConfig;
