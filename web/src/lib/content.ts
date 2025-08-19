// zero-dependency content provider

export type Zone = {
  slug: string;
  title: string;
  tagline: string;
};

export type Doc = {
  id: string;
  title: string;
  summary: string;
  zone?: string; // optional zone association
  body: string;
};

export const zones: Zone[] = [
  { slug: "music",        title: "Music",        tagline: "Create, listen, play." },
  { slug: "wellness",     title: "Wellness",     tagline: "Mind & body." },
  { slug: "creator-lab",  title: "Creator Lab",  tagline: "Make and learn." },
  { slug: "community",    title: "Community",    tagline: "Clubs & groups." },
  { slug: "teachers",     title: "Teachers",     tagline: "Classroom tools." },
  { slug: "partners",     title: "Partners",     tagline: "Collaborations." },
  { slug: "naturversity", title: "Naturversity", tagline: "Courses & paths." },
  { slug: "parents",      title: "Parents",      tagline: "Guides for home." },
];

export const stories: Doc[] = [
  { id: "sprout-journey", title: "The Sprout’s Journey",
    summary: "A short story about growth and curiosity.",
    zone: "naturversity",
    body: "Once upon a time, a sprout learned **photosynthesis** by playing in the sun." },
  { id: "sound-city", title: "Sound City",
    summary: "Field notes from the Music Zone.",
    zone: "music",
    body: "Beats, loops, and friendly robots keep the rhythm going." },
];

export const quizzes: Doc[] = [
  { id: "eco-basics", title: "Eco Basics Quiz",
    summary: "5 quick questions on reduce-reuse-recycle.",
    zone: "parents",
    body: "Q1) Which bin gets paper?\nA) Blue.\n... (stub)" },
];

export const observations: Doc[] = [
  { id: "garden-log-001", title: "Garden Log #001",
    summary: "First sprouts observed after rainfall.",
    zone: "wellness",
    body: "Moist soil, ambient temp 20°C, sunlight 6h." },
];

export const tips: Doc[] = [
  { id: "hydrate", title: "Hydrate like a pro",
    summary: "Simple reminder system for water breaks.",
    zone: "wellness",
    body: "Set a 90-minute timer; drink a glass each chime." },
];

export type Game = { id: string; title: string; description: string; url: string };
export const games: Game[] = [
  { id: "runner", title: "Leaf Runner", description: "Endless runner with coins + hi-score.", url: "/games/runner/" },
  { id: "puzzle", title: "Eco Puzzle", description: "Match items to the right bins.", url: "/games/puzzle/" },
  { id: "fling",  title: "Seed Fling", description: "Slingshot seeds to grow trees.", url: "/games/fling/" },
];

// helpers
export const byId = (arr: Doc[], id?: string) => arr.find(d => d.id === id);
export const zoneBySlug = (slug?: string) => zones.find(z => z.slug === slug);
