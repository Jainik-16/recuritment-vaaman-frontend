/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Whenever the frontend calls /api/..., forward it to Frappe
        source: '/api/:path*',
        destination: 'https://ats.octavision.in/api/:path*',
      },
    ];
  },
}

export default nextConfig
