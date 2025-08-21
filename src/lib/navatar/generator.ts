import type { Base, Navatar } from "./types";

export const SPECIES: Record<Base, { name: string; emoji: string }[]> = {
  Animal: [
    { name: "Elephant", emoji: "🐘" }, { name: "Panda", emoji: "🐼" },
    { name: "Tiger", emoji: "🐯" }, { name: "Fox", emoji: "🦊" },
    { name: "Lion", emoji: "🦁" }, { name: "Macaw", emoji: "🦜" },
    { name: "Polar Bear", emoji: "🐻‍❄️" }, { name: "Kangaroo", emoji: "🦘" },
    { name: "Dolphin", emoji: "🐬" }, { name: "Owl", emoji: "🦉" }
  ],
  Fruit: [
    { name: "Mango", emoji: "🥭" }, { name: "Sakura Cherry", emoji: "🌸" },
    { name: "Coconut", emoji: "🥥" }, { name: "Kiwi", emoji: "🥝" },
    { name: "Banana", emoji: "🍌" }, { name: "Lemon", emoji: "🍋" }
  ],
  Insect: [
    { name: "Butterfly", emoji: "🦋" }, { name: "Ladybug", emoji: "🐞" },
    { name: "Bee", emoji: "🐝" }, { name: "Firefly", emoji: "🪲" }
  ],
  Spirit: [
    { name: "Forest Sprite", emoji: "🧚" }, { name: "River Spirit", emoji: "🌊" },
    { name: "Mountain Guardian", emoji: "⛰️" }, { name: "Starlight Wisp", emoji: "✨" }
  ]
};

const COLORS = ["#22c55e","#16a34a","#0ea5e9","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#e11d48"];
const POWERS = [
  "Nature Whisper", "Echo Location", "Wind Step", "Leaf Shield", "River Glide",
  "Solar Burst", "Moonlight Heal", "Thunder Pounce", "Sand Sprint", "Coral Song"
];

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function id() { return "nav_" + Math.random().toString(36).slice(2, 10); }

export function generate(base: Base, speciesName?: string): Navatar {
  const list = SPECIES[base];
  const sp = speciesName ? list.find(s => s.name === speciesName)! : pick(list);
  const color = pick(COLORS);
  const name = makeName(sp.name);
  const power = pick(POWERS);
  const backstory = makeBackstory(name, base, sp.name, power);
  return {
    id: id(),
    base,
    species: sp.name,
    emoji: sp.emoji,
    color,
    power,
    name,
    backstory,
    createdAt: Date.now()
  };
}

export function makeName(species: string): string {
  const pre = ["Astra","Lumi","Nava","Kora","Talo","Mira","Sora","Ravi","Nori","Kiri"];
  const suf = ["wind","song","leaf","palm","glow","wing","grove","wave","stride","spark"];
  const twist = species.split(" ")[0].replace(/[aeiou]/gi,"").slice(0,3);
  return pick(pre) + " " + (twist || "Terra") + pick(suf);
}

export function makeBackstory(name: string, base: Base, species: string, power: string): string {
  return `${name} is a ${species} ${base.toLowerCase()} raised in the Naturverse. ` +
    `They discovered the power of “${power}” while completing quests across the kingdoms. ` +
    `Their mission: protect habitats and guide explorers through challenges with kindness and courage.`;
}
