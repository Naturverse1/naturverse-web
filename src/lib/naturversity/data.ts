import { Course, Partner, Teacher } from "./types";

export const TEACHERS: Teacher[] = [
  { id: "thai-lin", name: "Lin", kingdom: "Thailandia", specialty: "Mangrove ecology" },
  { id: "brazil-luz", name: "Luz", kingdom: "Brazilandia", specialty: "Macaw conservation" },
  { id: "indira", name: "Indira", kingdom: "Indilandia", specialty: "Urban gardens" },
  { id: "ama-kofi", name: "Kofi", kingdom: "Africania", specialty: "Savanna trackers" },
  { id: "kiwi-ari", name: "Ari", kingdom: "Kiwilandia", specialty: "Alpine fungi" },
];

export const PARTNERS: Partner[] = [
  { id: "reefcare", name: "ReefCare", focus: "Coral restoration" },
  { id: "seedshare", name: "SeedShare", focus: "Community seed banks" },
  { id: "greenpaths", name: "GreenPaths", focus: "Trails & clean ups" },
];

export const COURSES: Course[] = [
  {
    slug: "nature-101",
    title: "Nature 101",
    summary: "Field basics: habitats, food webs, and local species.",
    track: "Nature",
    emoji: "🌿",
    lessons: [
      { id: "n1", title: "Habitats", summary: "Forest, reef, savanna, and city niches." },
      { id: "n2", title: "Food Webs", summary: "Producers, consumers, decomposers." },
      { id: "n3", title: "ID Skills", summary: "Observation tips and note-taking." },
    ],
  },
  {
    slug: "art-lab",
    title: "Art Lab",
    summary: "Sketch, color, and compose with nature references.",
    track: "Art",
    emoji: "🎨",
    lessons: [
      { id: "a1", title: "Shapes in Nature", summary: "Fractals, spirals, symmetry." },
      { id: "a2", title: "Palette", summary: "Natural color picking." },
      { id: "a3", title: "Card Layout", summary: "Design a character card." },
    ],
  },
  {
    slug: "music-maker",
    title: "Music Maker",
    summary: "Beats, loops, and a karaoke warm-up.",
    track: "Music",
    emoji: "🎵",
    lessons: [
      { id: "m1", title: "Rhythm", summary: "Counts, bars, and claps." },
      { id: "m2", title: "Loops", summary: "Layer simple patterns." },
      { id: "m3", title: "Sing!", summary: "Starter karaoke set." },
    ],
  },
  {
    slug: "wellness-basics",
    title: "Wellness Basics",
    summary: "Breath, stretch, and mindful quests.",
    track: "Wellness",
    emoji: "🧘",
    lessons: [
      { id: "w1", title: "Breathing", summary: "Box and 4-7-8." },
      { id: "w2", title: "Mobility", summary: "Neck, shoulders, hips flow." },
      { id: "w3", title: "Mini Quest", summary: "5-minute nature walk." },
    ],
  },
  {
    slug: "crypto-basics",
    title: "Crypto Basics",
    summary: "Safety, wallets, and the NATUR token intro.",
    track: "Crypto",
    emoji: "🪙",
    lessons: [
      { id: "c1", title: "Safety First", summary: "Keys, scams, and good habits." },
      { id: "c2", title: "Wallets", summary: "Custodial vs. self-custody." },
      { id: "c3", title: "NATUR Token", summary: "Earnings and redemptions (overview)." },
    ],
  },
];

