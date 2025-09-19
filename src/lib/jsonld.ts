import { SITE } from './site';

export const siteUrl =
  import.meta.env.VITE_SITE_URL || SITE.url;

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: siteUrl,
  logo: `${siteUrl}/favicons/android-chrome-192x192.png`,
  sameAs: Object.values(SITE.socials),
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  name: SITE.name,
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
