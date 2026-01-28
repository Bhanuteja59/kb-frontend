/** @type {import('next').NextConfig} */
const nextConfig = {
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
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000", "hoa-frontend-beryl.vercel.app"]
        }
    }
};

module.exports = nextConfig;
