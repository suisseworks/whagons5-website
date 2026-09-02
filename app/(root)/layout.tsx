import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://whagons.com'),
};

export default function RootFallbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-419">
      <body>{children}</body>
    </html>
  );
}
