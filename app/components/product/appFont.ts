import localFont from 'next/font/local';

// The Whagons app uses the system UI font; Inter renders the same way on every
// platform, so the HTML product screens use it. Self-hosted so builds never
// depend on Google Fonts.
export const appFont = localFont({ src: '../../fonts/inter-latin.woff2', weight: '400 700', display: 'swap' });
