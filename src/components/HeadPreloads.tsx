import { Helmet } from "react-helmet-async";

/** 
 * Safe head hints: preconnects + favicons.
 * Only references files that exist in /public per your listing.
 */
export default function HeadPreloads() {
  return (
    <Helmet>
      {/* Perf hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Favicon family – preload a couple so the header icon is instant */}
      <link rel="preload" as="image" href="/favicon-32x32.png" />
      <link rel="preload" as="image" href="/favicon-64x64.png" />
      {/* regular favicons (keep what you already had too) */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* modern PWA-capable tags to silence the console note */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Helmet>
  );
}
