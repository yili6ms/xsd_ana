/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize images for Vercel
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
