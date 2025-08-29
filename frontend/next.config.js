/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:6000',
    SITE_URL: 'https://texttoreels.in',
    SITE_NAME: 'TextToReels.in',
  },
  // Configure for large scale static generation
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
};

module.exports = nextConfig;