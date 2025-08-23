export type Starter = { en: string; native: string; romanized: string };
export type CountItem = { num: number; native: string; romanized: string };
export type Language = {
  slug: string;
  name: string;
  nativeName: string;
  region: string;
  heroImg: string;
  secondaryImg: string;
  starter: Starter[];
  alphabet: { note: string };
  count: CountItem[];
};

const STARTER: Starter[] = [
  { en: "Hello", native: "สวัสดี", romanized: "sà-wàt-dee" },
  { en: "Thank you", native: "ขอบคุณ", romanized: "khàwp-khun" },
];

const ALPHABET_NOTE = "ก (gor) • ข (khor) • ค (khor) • ง (ngor) • จ (jor)";

const COUNT: CountItem[] = [
  { num: 1, native: "๑", romanized: "nùeng" },
  { num: 2, native: "๒", romanized: "sŏng" },
  { num: 3, native: "๓", romanized: "sǎam" },
  { num: 4, native: "๔", romanized: "sìi" },
  { num: 5, native: "๕", romanized: "hâa" },
  { num: 6, native: "๖", romanized: "hòk" },
  { num: 7, native: "๗", romanized: "jèt" },
  { num: 8, native: "๘", romanized: "bpàet" },
  { num: 9, native: "๙", romanized: "gâo" },
  { num: 10, native: "๑๐", romanized: "sǐp" },
];

export const LANGUAGES: Language[] = [
  {
    slug: "thailandia",
    name: "Thailandia (Thai)",
    nativeName: "ไทย",
    region: "Thailandia",
    heroImg: "Mangolanguagemainthai.png",
    secondaryImg: "Turianlanguage.png",
    starter: STARTER,
    alphabet: { note: ALPHABET_NOTE },
    count: COUNT,
  },
  {
    slug: "chinadia",
    name: "Chinadia (Mandarin)",
    nativeName: "中文",
    region: "Chinadia",
    heroImg: "Cranelanguagemainchina.png",
    secondaryImg: "Turianlanguagechina.png",
    starter: STARTER,
    alphabet: { note: ALPHABET_NOTE },
    count: COUNT,
  },
  {
    slug: "indillandia",
    name: "Indillandia (Hindi)",
    nativeName: "हिंदी",
    region: "Indillandia",
    heroImg: "Genielanguagemainindi.png",
    secondaryImg: "Turianlanguagehindi.png",
    starter: STARTER,
    alphabet: { note: ALPHABET_NOTE },
    count: COUNT,
  },
  {
    slug: "brazilandia",
    name: "Brazilandia (Portuguese)",
    nativeName: "Português",
    region: "Brazilandia",
    heroImg: "Birdlanguagemainbrazil.png",
    secondaryImg: "Turianlanguagebrazil.png",
    starter: STARTER,
    alphabet: { note: ALPHABET_NOTE },
    count: COUNT,
  },
  {
    slug: "australandia",
    name: "Australandia (English)",
    nativeName: "English",
    region: "Australandia",
    heroImg: "Koalalanguagemain.png",
    secondaryImg: "Birdlanguageaustralandia.png",
    starter: STARTER,
    alphabet: { note: ALPHABET_NOTE },
    count: COUNT,
  },
  {
    slug: "amerilandia",
    name: "Amerilandia (English)",
    nativeName: "English",
    region: "Amerilandia",
    heroImg: "Owllanguagemain.png",
    secondaryImg: "Turianlanguageenglish.png",
    starter: STARTER,
    alphabet: { note: ALPHABET_NOTE },
    count: COUNT,
  },
];

export function getLanguage(slug: string | undefined) {
  return LANGUAGES.find((l) => l.slug === slug);
}
