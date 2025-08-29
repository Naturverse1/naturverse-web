export type Navatar = { id: string; name: string; tier: 'starter' | 'rare' | 'legend'; svg: string };

export const STARTER_NAVATARS: Navatar[] = [
  { id: 'leafling-01', name: 'Leafling', tier: 'starter', svg: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#a3e635"/></svg>` },
  { id: 'leafling-02', name: 'Leafling', tier: 'starter', svg: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#86efac"/></svg>` },
  { id: 'seedling-01', name: 'Seedling', tier: 'starter', svg: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28z" fill="#bbf7d0"/></svg>` },
];
