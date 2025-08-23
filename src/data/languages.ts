export type Language = {
  id: string;
  name: string;
  native: string;
  cover?: string;   // main card image
  detail?: string;  // inner/secondary image
};

export const LANGUAGES: Language[] = [
  {
    id: "thailandia",
    name: "Thailandia (Thai)",
    native: "ไทย",
    cover: "/Languages/Mangolanguagemainthai.png",
    // You can swap this to a Thai-specific detail later if you add one.
    detail: "/Languages/Turianlanguage.png",
  },
  {
    id: "chinadia",
    name: "Chinadia (Mandarin)",
    native: "中文",
    cover: "/Languages/Cranelanguagemainchina.png",
    detail: "/Languages/Turianlanguagechina.png",
  },
  {
    id: "indillandia",
    name: "Indillandia (Hindi)",
    native: "हिंदी",
    cover: "/Languages/Genielanguagemainindi.png",
    detail: "/Languages/Turianlanguagehindi.png",
  },
  {
    id: "brazilandia",
    name: "Brazilandia (Portuguese)",
    native: "Português",
    cover: "/Languages/Birdlanguagemainbrazil.png",
    detail: "/Languages/Turianlanguagebrazil.png",
  },
  {
    id: "australandia",
    name: "Australandia (English)",
    native: "English",
    // You uploaded both a koala and a bird—use koala as card cover.
    cover: "/Languages/Koalalanguagemain.png",
    detail: "/Languages/Birdlanguageaustralandia.png",
  },
  {
    id: "amerilandia",
    name: "Amerilandia (English)",
    native: "English",
    cover: "/Languages/Owllanguagemain.png",
    detail: "/Languages/Turianlanguageenglish.png",
  },
];

export function getLanguageById(id: string): Language | undefined {
  return LANGUAGES.find(l => l.id === id);
}
