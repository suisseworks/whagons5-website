/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ] },
      // Blog and home animations. With the default max-age=0, Cloudflare
      // revalidates every request and answers range requests with the whole
      // file, and Safari on iOS will not play video without 206 responses.
      { source: '/media/:path*', headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
      ] },
    ];
  },
  // Windows developer machines may not have permission to create the symlinks
  // used by standalone output. Production keeps the standalone Docker build.
  output: process.env.NEXT_DISABLE_STANDALONE === '1' ? undefined : 'standalone',
}

module.exports = nextConfig
