/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nkammywsiesnqprurkwj.supabase.co',
      },
    ],
  },
  // other config options here
};

module.exports = nextConfig;
