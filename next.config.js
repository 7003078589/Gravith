/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for API routes to work
  // output: 'export',
  trailingSlash: false, // Changed to false to fix API route redirects
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  experimental: {
    serverComponentsExternalPackages: ['pg']
  }
}

module.exports = nextConfig

