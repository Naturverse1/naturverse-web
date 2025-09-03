export type Canon = { id: string; title: string; url: string };

const files = import.meta.glob('/public/navatars/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const toTitle = (s: string) =>
  s.replace(/\.(png|jpe?g|webp)$/i, '').replace(/[_-]+/g, ' ').trim();

const toId = (s: string) =>
  toTitle(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CANONS: Canon[] = Object.entries(files)
  .map(([key, url]) => {
    const filename = decodeURIComponent(key.split('/').pop() || '');
    const title = toTitle(filename);
    return { id: toId(filename), title, url };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export default CANONS;
