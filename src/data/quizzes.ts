export type Quiz = {
  slug: string; title: string;
  questions: { q: string; choices: string[]; answer: number }[]
}
export const quizzes: Quiz[] = [
  {
    slug: 'eco-basics',
    title: 'Eco Basics',
    questions: [
      { q: 'Which creature is a pollinator?', choices: ['Cat','Bee','Lizard','Fox'], answer: 1 },
      { q: 'Compost loves…', choices: ['Plastic','Glass','Food scraps','Metal'], answer: 2 },
    ]
  }
]
