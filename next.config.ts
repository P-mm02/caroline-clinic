import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'res.cloudinary.com', // ✅ Allow Cloudinary images
    ],
  },
}

export default nextConfig
