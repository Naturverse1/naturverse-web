export const siteUrl = import.meta.env.NEXT_PUBLIC_SITE_URL || 'https://thenaturverse.com';

export function ld<T extends object>(obj: T) {
  return { __html: JSON.stringify(obj) };
}

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
    'https://discord.gg'
  ],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  name: 'Naturverse',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export function breadcrumbsLd(path: string, labels: Record<string, string>) {
  const parts = path.split('/').filter(Boolean);
  const itemListElement = parts.map((seg, i) => {
    const slug = '/' + parts.slice(0, i + 1).join('/');
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: labels[slug] || seg[0]?.toUpperCase() + seg.slice(1),
      item: `${siteUrl}${slug}`,
    };
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function itemListLd(name: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      url: `${siteUrl}${it.path}`,
    })),
  };
}
