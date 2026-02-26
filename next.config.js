/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  // Disable static optimization for pages that need runtime env vars
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig
