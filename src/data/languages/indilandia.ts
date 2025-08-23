import { LangData } from "./types";

const IN: LangData = {
  slug: "indilandia",
  name: "Indilandia (Hindi)",
  nativeName: "हिन्दी",
  flagPath: "/assets/indilandia/flag.png",
  heroPath: "/assets/indilandia/map.png",
  phrasebook: [
    { key: "Hello", native: "नमस्ते", roman: "namaste" },
    { key: "Thank you", native: "धन्यवाद", roman: "dhanyavaad" },
    { key: "Goodbye", native: "अलविदा", roman: "alvida" },
    { key: "Yes", native: "हाँ", roman: "haan" },
    { key: "No", native: "नहीं", roman: "nahin" },
  ],
  numbers: [
    { value: 1, native: "एक", roman: "ek" },
    { value: 2, native: "दो", roman: "do" },
    { value: 3, native: "तीन", roman: "teen" },
    { value: 4, native: "चार", roman: "chaar" },
    { value: 5, native: "पाँच", roman: "paanch" },
    { value: 6, native: "छह", roman: "chhah" },
    { value: 7, native: "सात", roman: "saat" },
    { value: 8, native: "आठ", roman: "aath" },
    { value: 9, native: "नौ", roman: "nau" },
    { value: 10, native: "दस", roman: "das" },
  ],
  colors: [
    { en: "Red", native: "लाल", roman: "laal" },
    { en: "Blue", native: "नीला", roman: "neela" },
    { en: "Green", native: "हरा", roman: "hara" },
    { en: "Yellow", native: "पीला", roman: "peela" },
  ],
};

export default IN;
