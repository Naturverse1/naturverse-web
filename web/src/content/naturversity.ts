export type Lesson = {
  id: string;
  title: string;
  duration: string;
  kind: "read" | "watch" | "activity";
  summary: string;
  body: string; // plain text for now
};

export type Unit = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export const naturversityUnits: Unit[] = [
  {
    id: "rainforest-basics",
    title: "Rainforest Basics",
    lessons: [
      {
        id: "rf-1",
        title: "What is a Rainforest?",
        duration: "4 min",
        kind: "read",
        summary: "Layers, climate, and why rainforests matter.",
        body:
          "Rainforests are dense, warm, and full of life! They have layers: emergent, canopy, understory, and forest floor. Each layer is a home for unique plants and animals.",
      },
      {
        id: "rf-2",
        title: "Meet the Canopy",
        duration: "3 min",
        kind: "watch",
        summary: "Imagine living in the tree-tops!",
        body:
          "The canopy is a leafy rooftop. Many animals live here: monkeys, sloths, colorful birds. They move along branches like highways.",
      },
      {
        id: "rf-3",
        title: "Mini-Quest: Leaf Explorer",
        duration: "1 activity",
        kind: "activity",
        summary: "Find 3 different leaves outside and compare shapes.",
        body:
          "Find three different leaves. Sketch or photograph them. What shapes do you see? Smooth or jagged edges? Thick or thin?",
      },
    ],
  },
  {
    id: "ocean-intro",
    title: "Ocean Intro",
    lessons: [
      {
        id: "oc-1",
        title: "Ocean Zones",
        duration: "5 min",
        kind: "read",
        summary: "From sunlit shallows to the midnight zone.",
        body:
          "The ocean has zones based on light: Sunlight, Twilight, Midnight, Abyss, Trenches. Different creatures adapt to each light level.",
      },
    ],
  },
];
