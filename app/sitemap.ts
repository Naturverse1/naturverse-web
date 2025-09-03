import type { MetadataRoute } from 'next';
import { SITE_URL } from './lib/site';

export const dynamic = 'force-static';

const PAGES = [
  '/',
  '/worlds',
  '/zones',
  '/marketplace',
  '/cart',
  '/marketplace/wishlist',
  '/marketplace/checkout',
  '/naturversity',
  '/naturbank',
  '/navatar',
  '/passport',
  '/turian',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PAGES.map((path, i) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7 - i * 0.01,
  }));
}
