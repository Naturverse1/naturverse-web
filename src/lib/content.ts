export type WorldKey =
  | "thailandia" | "brazilandia" | "indilandia" | "amerilandia" | "australandia" | "chilandia"
  | "chinadia" | "japonica" | "africania" | "europalia" | "britannula" | "kiwlandia"
  | "madagascaria" | "greenlandia" | "antarcticland";

export const WORLDS: Record<WorldKey, {
  title: string;
  fruitAnimal: string;
  hero: string;
  mapImage?: string;
  bannerImage?: string;
  blurb: string;
}> = {
  thailandia:    { title: "Thailandia",    fruitAnimal: "Durian & Elephants", hero: "Turian the Durian",
    mapImage: "/attached_assets/Thailandia_Map.png", bannerImage: "/attached_assets/Turian_Banner.png",
    blurb: "Main realm. Meet Turian and friends, begin your passport journey." },
  brazilandia:   { title: "Brazilandia",   fruitAnimal: "Bananas & Parrots",   hero: "Pipi the Parrot", blurb: "Rainforest rhythms and beach football." },
  indilandia:    { title: "Indilandia",    fruitAnimal: "Mangoes & Tigers",    hero: "Raja the Tiger",  blurb: "Spices, stories, and sari-bright festivals." },
  amerilandia:   { title: "Amerilandia",   fruitAnimal: "Apples & Eagles",     hero: "Libby the Eagle", blurb: "Parks, canyons, and star-spangled science." },
  australandia:  { title: "Australandia",  fruitAnimal: "Peaches & Kangaroos", hero: "Kip the Roo",     blurb: "Outback quests and reef guardians." },
  chilandia:     { title: "Chilandia",     fruitAnimal: "Chillies & Llamas",   hero: "Lalo the Llama",  blurb: "Andean peaks and cosmic skies." },
  chinadia:      { title: "Chinadia",      fruitAnimal: "Bamboo & Pandas",     hero: "Bao the Panda",   blurb: "Brush art, bamboo codes, dragon dances." },
  japonica:      { title: "Japonica",      fruitAnimal: "Cherry Blossoms & Cranes", hero: "Momo the Crane", blurb: "Robots, ramen, and sakura logic." },
  africania:     { title: "Africania",     fruitAnimal: "Mangoes & Lions",     hero: "Sefu the Lion",   blurb: "Savanna symphonies and stargazing." },
  europalia:     { title: "Europalia",     fruitAnimal: "Sunflowers & Hedgehogs", hero: "Pip the Hedgehog", blurb: "Museums, mountains, and mosaics." },
  britannula:    { title: "Britannula",    fruitAnimal: "Roses & Hedgehogs",   hero: "Thorn the Hog",   blurb: "Castles, cliffs, and cozy tea math." },
  kiwlandia:     { title: "Kiwlandia",     fruitAnimal: "Kiwis & Sheep",       hero: "Kiri the Kiwi",   blurb: "Glow-worm caves and mountain mist." },
  madagascaria:  { title: "Madagascaria",  fruitAnimal: "Lemons & Lemurs",     hero: "Zaza the Lemur",  blurb: "Baobab puzzles and coral coves." },
  greenlandia:   { title: "Greenlandia",   fruitAnimal: "Ice & Polar Bears",   hero: "Nukka the Bear",  blurb: "Auroras, ice craft, and sled logic." },
  antarcticland: { title: "Antarcticland", fruitAnimal: "Ice Crystals & Penguins", hero: "Pipin the Penguin", blurb: "Research stations and icy riddles." },
};

export const HUBS = [
  { path: "/naturbank", title: "NaturBank", blurb: "Wallets, NFTs, learn & earn with $NATUR." },
  { path: "/navatar", title: "Navatar Creator", blurb: "Create your own Navatar, story, powers & passport." },
  { path: "/zones/music", title: "Music Zone", blurb: "Karaoke, beats & AI song maker." },
  { path: "/zones/wellness", title: "Wellness Zone", blurb: "Yoga, breathing, stretches & mindful quests." },
  { path: "/zones/creator-lab", title: "Creator Lab", blurb: "AI art & character cards." },
  { path: "/zones/observations", title: "Observations", blurb: "Upload nature pics; tag, learn, earn." },
  { path: "/zones/stories", title: "Stories", blurb: "AI story paths set in the 14 kingdoms." },
  { path: "/zones/quizzes", title: "Quizzes", blurb: "Solo & party play with leaderboards." },
];
