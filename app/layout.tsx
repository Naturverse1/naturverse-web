import { SITE } from '@/lib/site';
import type { ReactNode } from 'react';
import "../styles/globals.css";
import "../styles/nav.css";

// ensure absolute URLs in SEO metadata
export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
