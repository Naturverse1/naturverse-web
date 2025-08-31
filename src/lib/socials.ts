import type { ReactNode } from 'react';

export type SocialLink = {
  name: 'X' | 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook';
  href: string;
  icon?: ReactNode; // Footer can supply icons
  aria?: string;
};

export const SOCIALS: SocialLink[] = [
  {
    name: 'X',
    href: 'https://x.com/TuriantheDurian',
    aria: 'Follow us on X',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/turianthedurian',
    aria: 'Follow us on Instagram',
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@turian.the.durian',
    aria: 'Follow us on TikTok',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@TuriantheDurian',
    aria: 'Subscribe on YouTube',
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/TurianMediaCompany',
    aria: 'Like us on Facebook',
  },
];
