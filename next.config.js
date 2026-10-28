const fs = require('fs');
const path = require('path');

// The pages of a static client site, read from public/ at build time. The
// middleware sends any other path under the site to the site's own 404 page.
function clientPages(client) {
  const root = path.join(__dirname, 'public', 'clients', client);
  const pages = [];
  const walk = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name), `${rel}/${entry.name}`);
      else if (entry.name === 'index.html') pages.push(rel);
    }
  };
  if (fs.existsSync(path.join(root, '404.html'))) walk(root, '');
  return pages.join('|');
}

const CRONUS_CSP = "default-src 'self'; script-src 'self' 'sha256-SvAsvEhfxgF1Xxjt3OVr6KB8ut/IasvaUH4icQhMMMY=' https://www.googletagmanager.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' data: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://cloudflareinsights.com https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{
      source: '/las-vegas',
      destination: 'https://pageup.whagons.com/01a15986-6781-7777-a282-5fa5a463dd75',
      permanent: false,
    }];
  },
  env: {
    CRONUS2_PAGES: clientPages('cronus2'),
  },
  // Static client sites served from public/clients/<name>/index.html.
  // Multi-page sites keep each page in <page>/index.html. These rewrites run
  // after public files are matched, so real assets are served as they are.
  async rewrites() {
    return [
      { source: '/clients/:client', destination: '/clients/:client/index.html' },
      { source: '/clients/:client/:page+', destination: '/clients/:client/:page+/index.html' },
    ];
  },
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
      // Client-site video, for the same reason as /media.
      { source: '/clients/:client/video/:path*', headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
      ] },
      // Cronus client site. The policy comes from the site's own build
      // (python3 tools/build.py --print-csp in matas432/cronus-website); it
      // already allows Google Analytics, Turnstile and Cloudflare's beacon.
      // This is a review copy, so search engines are told not to index it.
      { source: '/clients/cronus2/:path*', headers: [
        { key: 'Content-Security-Policy', value: CRONUS_CSP },
        { key: 'X-Robots-Tag', value: 'noindex' },
      ] },
      // Its CSS and JS names carry a content hash; fonts never change.
      { source: '/clients/cronus2/:dir(css|js|fonts)/:file*', headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ] },
      // Astro build output in client sites; file names are content-hashed.
      { source: '/clients/:client/_astro/:path*', headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ] },
    ];
  },
  // Windows developer machines may not have permission to create the symlinks
  // used by standalone output. Production keeps the standalone Docker build.
  output: process.env.NEXT_DISABLE_STANDALONE === '1' ? undefined : 'standalone',
}

module.exports = nextConfig
