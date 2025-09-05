import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import "../styles/globals.css";
import "../styles/nav.css";
import "../styles/chat.css";
import TurianAssistant from "@/components/TurianAssistant";

// ensure absolute URLs in SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <TurianAssistant />
      </body>
    </html>
  );
}
