export const siteUrl =
  import.meta.env.NEXT_PUBLIC_SITE_URL || 'https://thenaturverse.com';

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Naturverse',
  url: siteUrl,
  logo: `${siteUrl}/favicons/android-chrome-192x192.png`,
  sameAs: [
    'https://x.com/naturverse',
    'https://instagram.com/naturverse',
    'https://youtube.com/@naturverse',
    'https://discord.gg',
  ],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  name: 'Naturverse',
};

export const breadcrumbs = (
  path: string,
  map: Record<string, string> = {},
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: path
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => {
      const slug = '/' + arr.slice(0, i + 1).join('/');
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: map[slug] || seg.charAt(0).toUpperCase() + seg.slice(1),
        item: `${siteUrl}${slug}`,
      };
    }),
});
