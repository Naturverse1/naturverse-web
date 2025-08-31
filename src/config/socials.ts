export const SOCIALS = {
  x: "https://x.com/TuriantheDurian",
  instagram: "https://instagram.com/TuriantheDurian",
  tiktok: "https://tiktok.com/@TuriantheDurian",
  youtube: "https://www.youtube.com/@TuriantheDurian",
  facebook: "https://www.facebook.com/TuriantheDurian",
} as const;

export type SocialKey = keyof typeof SOCIALS;
