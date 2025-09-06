type NavatarBase = "Animal" | "Fruit" | "Insect" | "Spirit";

export const SPECIES: Record<NavatarBase, string[]> = {
  Animal: [
    "Red Panda","Snow Leopard","Sea Turtle","Barn Owl","Dolphin","Koala","Elephant",
    "Macaw","Hedgehog","Arctic Fox","Tiger","Camel","Kangaroo","Wolf","Penguin"
  ],
  Fruit: [
    "Mango","Coconut","Banana","Dragonfruit","Pineapple","Peach","Kiwi","Lychee",
    "Guava","Pomegranate","Blueberry","Apple","Grapes","Cherry","Lemon"
  ],
  Insect: [
    "Butterfly","Firefly","Ladybug","Praying Mantis","Honeybee","Stag Beetle","Ant",
    "Cicada","Dragonfly","Atlas Moth"
  ],
  Spirit: [
    "Forest Sprite","River Nymph","Sand Wisp","Storm Djinn","Aurora Spirit",
    "Bloom Pixie","Stone Guardian","Ember Wisp","Mist Walker"
  ],
};

export const POWERS_BANK: string[] = [
  "Nature Whisper","Fast Learner","Team Boost","Calm Aura","Trailblazer",
  "Water Breathe","Leaf Shield","Night Vision","Echo Sense","Quick Craft",
  "Lucky Charm","Ice Step","Sunbeam Heal","Song Maker","Puzzle Vision"
];

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
