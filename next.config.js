/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['apicxotv.techplusmedia.com'], // Your image domain
    },
    // Remove the outdated fontLoaders experimental option
    experimental: {
        // Keep other experimental options if needed, but remove fontLoaders
    },
    // Handle font loading issues with longer timeout
    httpAgentOptions: {
        timeout: 60000, // 60 seconds timeout for font requests
    },
};

module.exports = nextConfig;