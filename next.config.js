<<<<<<< HEAD
module.exports = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.gstatic.com',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
            },
        ],
    },
};
=======
// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["localhost:3000", "hoa-frontend-beryl.vercel.app"] } }
};
module.exports = nextConfig;
>>>>>>> 542d1c491fbc7678e2c6a8cb451bac3dfa5cbe5d
