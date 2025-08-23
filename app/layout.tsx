import type { Metadata } from 'next';
import { SITE_URL } from './lib/site';

// ensure absolute URLs in SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
