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
    // Commenting out experimental config to ensure stable build first
    /*
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000", "hoa-frontend-beryl.vercel.app"]
        }
    }
    */
};

module.exports = nextConfig;
