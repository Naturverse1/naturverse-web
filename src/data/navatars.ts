export type Navatar = { id: string; name: string; tier: 'starter'|'rare'|'legend'; svg: string };

const S = (p: string) => `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#2563eb" stroke-width="2"><circle cx="48" cy="48" r="44" fill="#eaf1ff"/><path d="${p}" fill="#bcd3ff"/></g></svg>`;

export const STARTER_NAVATARS: Navatar[] = [
  { id:'leafling-01', name:'Leafling', tier:'starter', svg:S('M30 60c10-20 26-20 36 0-12 6-24 6-36 0z') },
  { id:'leafling-02', name:'Leafling', tier:'starter', svg:S('M22 52c8-18 44-18 52 0-18 8-34 8-52 0z') },
  { id:'seedling-01', name:'Seedling', tier:'starter', svg:S('M48 24c12 8 12 24 0 40-12-16-12-32 0-40z') },
  { id:'sprout-01',   name:'Sprout',   tier:'starter', svg:S('M24 64c8-6 16-6 24 0 8-6 16-6 24 0-16 8-32 8-48 0z') },
];
