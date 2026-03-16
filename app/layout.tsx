import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whagons — Operational Intelligence Platform',
  description: 'Operational intelligence platform to manage and optimize operations in organizations with complex physical processes. AI-powered, modular, real-time.',
  icons: {
    icon: '/whagons.svg',
  },
  openGraph: {
    title: 'Whagons — Operational Intelligence in Action',
    description: 'Manage and optimize complex physical operations with AI-powered workflows, real-time analytics, and SLA engines.',
    siteName: 'Whagons',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whagons — Operational Intelligence in Action',
    description: 'Manage and optimize complex physical operations with AI-powered workflows, real-time analytics, and SLA engines.',
  },
  keywords: ['operational intelligence', 'operations management', 'SLA engine', 'workflow automation', 'asset management', 'hospitality operations', 'industrial maintenance'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Instrument+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
