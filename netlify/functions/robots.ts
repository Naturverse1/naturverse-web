// Dynamic robots.txt
// Path: /.netlify/functions/robots  (routed from /robots.txt via netlify.toml)
export default async () => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Sitemap: https://thenaturverse.com/sitemap.xml'
  ];
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
  });
};
