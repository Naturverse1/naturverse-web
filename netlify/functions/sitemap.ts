// Dynamic sitemap function
// Path: /.netlify/functions/sitemap  (routed from /sitemap.xml via netlify.toml)
export default async () => {
  const base = 'https://thenaturverse.com';
  // TODO: expand this list or generate from content
  const urls = [
    '/', '/worlds', '/zones', '/marketplace',
    '/marketplace/wishlist', '/naturversity', '/naturbank', '/navatar', '/passport'
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u =>
      `  <url><loc>${base}${u}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`
    ).join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=UTF-8' }
  });
};
