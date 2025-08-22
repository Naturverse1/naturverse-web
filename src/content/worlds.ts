export type WorldKey =
  | "Thailandia" | "Brazilandia" | "Amerilandia" | "Australandia"
  | "Chilandia" | "Indillandia"
  | "Africania" | "Europalia" | "Britannula" | "Greenlandia"
  | "Japonica" | "Kiwilandia" | "Madagascaria" | "Anarcticland";

type Char = { name: string; img: string; role?: string };

export const WORLDS: Record<WorldKey, { mapSrc: string; alt: string; characters: Char[] }> = {
  Thailandia: {
    mapSrc: "/kingdoms/Thailandia/Thailandiamap.jpg",
    alt: "Thailandia map",
    characters: [
      { name: "Guide", img: "/kingdoms/Thailandia/Guide.png" },
      { name: "Inkie", img: "/kingdoms/Thailandia/Inkie.png" },
      { name: "Jen-Suex", img: "/kingdoms/Thailandia/Jen-Suex.png" },
      { name: "Snakers", img: "/kingdoms/Thailandia/Snakers.png" },
      { name: "Teeyor", img: "/kingdoms/Thailandia/Teeyor.png" },
      { name: "Tommy Tuk Tuk", img: "/kingdoms/Thailandia/Tommy Tuk Tuk.png" },
    ],
  },
  Brazilandia: {
    mapSrc: "/kingdoms/Brazilandia/Brazilandiamap.png",
    alt: "Brazilandia map",
    characters: [
      { name: "Lumatucan", img: "/kingdoms/Brazilandia/Lumatucan.png" },
      { name: "Ariamacaw", img: "/kingdoms/Brazilandia/Ariamacaw.png" },
      { name: "Jogospidermonkey", img: "/kingdoms/Brazilandia/Jogospidermonkey.png" },
      { name: "Sambasammusic", img: "/kingdoms/Brazilandia/Sambasammusic.png" },
      { name: "Amzonicaspirit", img: "/kingdoms/Brazilandia/Amzonicaspirit.png" },
      { name: "Chamleaan", img: "/kingdoms/Brazilandia/chamleaan.png" },
    ],
  },
  Amerilandia: {
    mapSrc: "/kingdoms/Amerilandia/Amerilandiamap.png",
    alt: "Amerilandia map",
    characters: [
      { name: "Baldeagle", img: "/kingdoms/Amerilandia/Baldeagle.png" },
      { name: "Owl", img: "/kingdoms/Amerilandia/Owl.png" },
      { name: "Racoon", img: "/kingdoms/Amerilandia/Racoon.png" },
      { name: "Sunflowersue", img: "/kingdoms/Amerilandia/Sunflowersue.png" },
      { name: "Aligatorsport", img: "/kingdoms/Amerilandia/Aligatorsport.png" },
      { name: "Pixie", img: "/kingdoms/Amerilandia/Pixie.png" },
    ],
  },
  Australandia: {
    mapSrc: "/kingdoms/Australandia/Australaniamap.png",
    alt: "Australandia map",
    characters: [
      { name: "Kangarooguide", img: "/kingdoms/Australandia/Kangarooguide.png" },
      { name: "Kangarotoon", img: "/kingdoms/Australandia/Kangarotoon.png" },
      { name: "Koala", img: "/kingdoms/Australandia/Koala.png" },
      { name: "Koalalt", img: "/kingdoms/Australandia/Koalalt.png" },
      { name: "Wallywombat", img: "/kingdoms/Australandia/Wallywombat.png" },
      { name: "Turtletwin1", img: "/kingdoms/Australandia/turtletwin1.png" },
    ],
  },
  Chilandia: {
    mapSrc: "/kingdoms/Chilandia/Chilandiamap.jpg",
    alt: "Chilandia map",
    characters: [
      { name: "Baobao Panda & Longwei Dragon", img: "/kingdoms/Chilandia/Baobaopandaandlongweidragon.png" },
      { name: "CraneWise", img: "/kingdoms/Chilandia/Cranewise.png" },
      { name: "LanternFox", img: "/kingdoms/Chilandia/Lanternfox.png" },
      { name: "Li Sporty Fox", img: "/kingdoms/Chilandia/Lisportyfox.png" },
      { name: "Meihua Blossom Spirit", img: "/kingdoms/Chilandia/Meihuablossomspirit.png" },
      { name: "Rat Twins", img: "/kingdoms/Chilandia/Rattwins.png" },
    ],
  },
  Indillandia: {
    mapSrc: "/kingdoms/Indillandia/Inlandiamap.png",
    alt: "Indillandia map",
    characters: [
      { name: "Genie Baba", img: "/kingdoms/Indillandia/Geniebaba.png" },
      { name: "Guru Cow", img: "/kingdoms/Indillandia/Gurucow.png" },
      { name: "Kai Cobra", img: "/kingdoms/Indillandia/Kaicobra.png" },
      { name: "Peacock Dancer", img: "/kingdoms/Indillandia/Peacockdancer.png" },
      { name: "Raja Elephant", img: "/kingdoms/Indillandia/RajaElephant.png" },
      { name: "Tiger Sport", img: "/kingdoms/Indillandia/Tigersport.png" },
    ],
  },

  // placeholders (wired so future drops “just work”)
  Africania:      { mapSrc: "/kingdoms/Africania/Africaniamap.png",      alt: "Africania map",      characters: [] },
  Europalia:      { mapSrc: "/kingdoms/Europalia/Europaliamap.png",      alt: "Europalia map",      characters: [] },
  Britannula:     { mapSrc: "/kingdoms/Britannula/Britannulamap.png",    alt: "Britannula map",     characters: [] },
  Greenlandia:    { mapSrc: "/kingdoms/Greenlandia/Greenlandiamap.png",  alt: "Greenlandia map",    characters: [] },
  Japonica:       { mapSrc: "/kingdoms/Japonica/Japonicamap.png",        alt: "Japonica map",       characters: [] },
  Kiwilandia:     { mapSrc: "/kingdoms/Kiwilandia/Kiwilandiamap.png",    alt: "Kiwilandia map",     characters: [] },
  Madagascaria:   { mapSrc: "/kingdoms/Madagascaria/Madagascarimap.png", alt: "Madagascaria map",   characters: [] },
  Anarcticland:   { mapSrc: "/kingdoms/Anarcticland/Anarcticlandmap.png",alt: "Anarcticland map",   characters: [] },
};
