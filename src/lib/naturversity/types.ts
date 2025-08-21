export type Teacher = { id: string; name: string; kingdom: string; specialty: string };
export type Partner = { id: string; name: string; focus: string };
export type Lesson = { id: string; title: string; summary: string };
export type Course = {
  slug: string;
  title: string;
  summary: string;
  track: "Nature" | "Art" | "Music" | "Wellness" | "Crypto";
  lessons: Lesson[];
  emoji?: string;
};

