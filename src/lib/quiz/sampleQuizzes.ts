import { Quiz } from "./types";

const id = () => Math.random().toString(36).slice(2, 9);

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: "classic-nature-basics",
    mode: "classic",
    emoji: "🌿",
    title: "Nature Basics",
    questions: [
      {
        id: id(),
        type: "mc",
        prompt: "Which biome has the highest biodiversity?",
        options: [
          { id: id(), text: "Tundra" },
          { id: id(), text: "Tropical Rainforest", correct: true },
          { id: id(), text: "Desert" },
          { id: id(), text: "Taiga" },
        ],
        explanation: "Warm temps + rain = many niches."
      },
      {
        id: id(),
        type: "mc",
        prompt: "Pollinators help plants by…",
        options: [
          { id: id(), text: "Spreading seeds" },
          { id: id(), text: "Carrying pollen between flowers", correct: true },
          { id: id(), text: "Making soil" },
          { id: id(), text: "Blocking pests" },
        ],
      },
      {
        id: id(),
        type: "mc",
        prompt: "Mangroves are important because they…",
        options: [
          { id: id(), text: "Increase ocean salinity" },
          { id: id(), text: "Protect coasts & store carbon", correct: true },
          { id: id(), text: "Only grow in freshwater" },
          { id: id(), text: "Are invasive everywhere" },
        ],
      },
    ],
  },

  // Jeopardy-style sample board
  {
    id: "jeopardy-14-realms",
    mode: "jeopardy",
    emoji: "🧭",
    title: "14 Kingdoms",
    board: [
      {
        id: id(),
        title: "Thailandia",
        cells: [
          { id: id(), points: 100, question: "This gentle giant is a national symbol.", answer: "What is the elephant?" },
          { id: id(), points: 200, question: "Sweet fruit often found by canals.", answer: "What is the mango?" },
          { id: id(), points: 300, question: "Floating shops are called this.", answer: "What is a floating market?" },
        ],
      },
      {
        id: id(),
        title: "Amazonia",
        cells: [
          { id: id(), points: 100, question: "The river with the world’s largest flow.", answer: "What is the Amazon?" },
          { id: id(), points: 200, question: "Bright birds that love clay licks.", answer: "What are macaws?" },
          { id: id(), points: 300, question: "Forest layer where most light hits.", answer: "What is the canopy?" },
        ],
      },
      {
        id: id(),
        title: "Arctica",
        cells: [
          { id: id(), points: 100, question: "The largest bear on land.", answer: "What is the polar bear?" },
          { id: id(), points: 200, question: "Sea ice loss is driven by this.", answer: "What is warming (climate change)?" },
          { id: id(), points: 300, question: "Tiny algae at the base of the food web.", answer: "What is phytoplankton?" },
        ],
      },
    ],
  },
];
