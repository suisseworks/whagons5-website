// Cloudflare and browsers cache /media for days (see next.config.js), so a
// re-rendered animation keeps its old file until the URL changes. Bump this
// whenever scripts/blog-media/render.mjs rewrites the videos.
const VIDEO_VERSION = '2';

export const videoSrc = (path: string) => `${path}?v=${VIDEO_VERSION}`;
