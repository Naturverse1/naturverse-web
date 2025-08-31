export function getHost(): string {
  if (typeof window !== 'undefined') return window.location.host;
  return process.env.VERCEL_URL || process.env.URL || 'localhost';
}

export function isPreviewHost(host = getHost()): boolean {
  // Treat Netlify preview/permalink as preview
  return /\.netlify\.app$/i.test(host);
}

export function isProdHost(host = getHost()): boolean {
  // Your production domains
  return /^(www\.)?thenaturverse\.com$/i.test(host) || /^naturverse-web\.pages\.dev$/i.test(host);
}
