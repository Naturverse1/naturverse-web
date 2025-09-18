export type NavatarSheet = {
  name: string;
  species: string;
  kingdom: string;
  traits: string[];
  powers: string[];
  tagline: string;
  imagePrompt: string;
};

export function navatarPrompt(seed: { age: number; vibe: string; likes: string[] }) {
  return { instructions: "Return NavatarSheet JSON only.", seed };
}

export type CardCopy = {
  headline: string;
  backstory: string;
  funFacts: string[];
};

export function cardPrompt(seed: { name: string; species: string; kingdom: string; powers: string[] }) {
  return { instructions: "Return CardCopy JSON only.", seed };
}

export type LessonPack = {
  title: string;
  summary: string;
  outline: string[];
  activity: string;
  quiz: { q: string; a: string[]; correct: number }[];
};

export function lessonPrompt(seed: { topic: string; age: number }) {
  return { instructions: "JSON only. Age-appropriate, positive.", seed };
}
