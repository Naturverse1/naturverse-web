export type World = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  kingdom: "Air" | "Water" | "Earth" | "Fire" | "Light" | "Shadow" | "Mind" | "Heart";
  difficulty: 1 | 2 | 3 | 4 | 5;
  zones: number;
  image?: string; // path under /images/worlds/*
  tags?: string[];
};

export const WORLDS: World[] = [
  {
    id: "w-air-balance",
    name: "Sky Balance",
    slug: "sky-balance",
    summary: "Breathing, calm, and balance mini-quests above the clouds.",
    kingdom: "Air",
    difficulty: 2,
    zones: 7,
    image: "/images/worlds/air-sky-balance.jpg",
    tags: ["breath", "calm", "focus"],
  },
  {
    id: "w-water-tides",
    name: "Tides of Flow",
    slug: "tides-of-flow",
    summary: "Movement and rhythm challenges along the coastlines.",
    kingdom: "Water",
    difficulty: 3,
    zones: 9,
    image: "/images/worlds/water-tides.jpg",
    tags: ["movement", "rhythm", "resilience"],
  },
  {
    id: "w-earth-roots",
    name: "Rooted Paths",
    slug: "rooted-paths",
    summary: "Grounding exercises and growth journeys in ancient forests.",
    kingdom: "Earth",
    difficulty: 2,
    zones: 6,
    image: "/images/worlds/earth-roots.jpg",
    tags: ["grounding", "growth", "nature"],
  },
  {
    id: "w-fire-sparks",
    name: "Sparks & Courage",
    slug: "sparks-and-courage",
    summary: "Energy, courage, and tiny dares around the campfire.",
    kingdom: "Fire",
    difficulty: 4,
    zones: 8,
    image: "/images/worlds/fire-sparks.jpg",
    tags: ["energy", "courage", "confidence"],
  },
  {
    id: "w-light-clarity",
    name: "Clarity Garden",
    slug: "clarity-garden",
    summary: "Mindful journaling & clarity puzzles in sunlit fields.",
    kingdom: "Light",
    difficulty: 1,
    zones: 5,
    image: "/images/worlds/light-clarity.jpg",
    tags: ["journaling", "clarity", "mindfulness"],
  },
  {
    id: "w-shadow-myst",
    name: "Misty Shadows",
    slug: "misty-shadows",
    summary: "Gentle exposure quests for worries & self-kindness.",
    kingdom: "Shadow",
    difficulty: 3,
    zones: 10,
    image: "/images/worlds/shadow-mist.jpg",
    tags: ["exposure", "self-kindness", "anxiety"],
  },
];

export type WorldKey = (typeof WORLDS)[number]["slug"];

export const getWorldBySlug = (slug: string) =>
  WORLDS.find((w) => w.slug === slug) || null;

