import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  jsonLd?: any;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({ title, description, image = '/og-default.jpg', url, jsonLd }: SeoProps) {
  useEffect(() => {
    const href = url || window.location.href;
    document.title = title;
    if (description) setMeta('description', description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);

    setProperty('og:title', title);
    if (description) setProperty('og:description', description);
    setProperty('og:url', href);
    setProperty('og:image', image);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    if (description) setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  }, [title, description, image, url]);

  return jsonLd ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  ) : null;
}

