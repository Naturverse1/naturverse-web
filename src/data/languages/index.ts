import { LangData } from "./types";
import TH from "./thailandia";
import CN from "./chinadia";
import IN from "./indilandia";
import BR from "./brazilandia";
import AU from "./australandia";
import US from "./amerilandia";

export const LANGUAGES: LangData[] = [TH, CN, IN, BR, AU, US];

export const bySlug = (slug: string): LangData | undefined =>
  LANGUAGES.find((l) => l.slug === slug);
