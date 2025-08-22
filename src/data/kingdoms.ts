export type KingdomId =
  | "thailandia"
  | "brazilandia"
  | "australandia"
  | "chilandia"
  | "indillandia"
  | "amerilandia";

export type KingdomData = {
  id: KingdomId;
  title: string;
  mapFile: string; // exact filename in /public/kingdoms/<TitleCase>/
  characters: string[]; // image filenames for that kingdom (PNG/WEBP/JPG)
};

// Helper to build a public URL and safely encode filenames with spaces etc.
export const imgUrl = (folderTitleCase: string, filename: string) =>
  `/kingdoms/${folderTitleCase}/${encodeURIComponent(filename)}`;

export const KINGDOMS: Record<KingdomId, KingdomData> = {
  thailandia: {
    id: "thailandia",
    title: "Thailandia",
    mapFile: "Thailandiamap.jpg", // per your folder
    characters: [
      "2kay.png",
      "Blu Butterfly.png",
      "Coconut Cruze.png",
      "Dow-Mean.png",
      "Dr P.png",
      "Frankie Frogs.png",
      "Guide.png",
      "Inkie.png",
      "Jay-Sing.png",
      "Jen-Suex.png",
      "Lao Cow.png",
      "Mango Mike.png",
      "Nikki MT.png",
      "Non-Bua.png",
      "Pineapple Pa-Pa.png",
      "Pineapple Petey.png",
      "Slitherkin.png",
      "Snakers.png",
      "Teeyor.png",
      "Tommy Tuk Tuk.png",
      "hank.png",
      "tuk kae sora 1.webp"
    ]
  },
  brazilandia: {
    id: "brazilandia",
    title: "Brazilandia",
    mapFile: "Brazilandiamap.png",
    characters: [
      "Amzonicaspirit.png",
      "Ariamacaw.png",
      "Jogospidermonkey.png",
      "Lumatucan.png",
      "Sambasammusic.png",
      "chamleaan.png"
    ]
  },
  australandia: {
    id: "australandia",
    title: "Australandia",
    mapFile: "Australaniamap.png",
    characters: [
      "Bird.png",
      "Groupof four.png",
      "Kangarooguide.png",
      "Kangarootoon.png",
      "Koala.png",
      "Koalalt.png",
      "koalazen.png",
      "Platapus.png",
      "turtletwin1.png",
      "Turtletwin2.png",
      "Wallywombat.png"
    ]
  },
  chilandia: {
    id: "chilandia",
    title: "Chilandia",
    mapFile: "Chilandiamap.jpg",
    characters: [
      "Baobaopandaandlongweidragon.png",
      "Bodrummer.png",
      "Cranewise.png",
      "Lanternfox.png",
      "Lisportyfox.png",
      "Meihuablossomspirit.png",
      "Rattwins.png",
      "unamamed.png"
    ]
  },
  indillandia: {
    id: "indillandia",
    title: "Indillandia",
    mapFile: "Inlandiamap.png",
    characters: [
      "Geniebaba.png",
      "Gurucow.png",
      "Kaicobra.png",
      "Peacockdancer.png",
      "RajaElephant.png",
      "Tigersport.png"
    ]
  },
  amerilandia: {
    id: "amerilandia",
    title: "Amerilandia",
    mapFile: "Amerilandiamap.png",
    characters: [
      "Aligatorsport.png",
      "Baldeagle.png",
      "Owl.png",
      "Pixie.png",
      "Racoon.png",
      "Sunflowersue.png"
    ]
  }
};
