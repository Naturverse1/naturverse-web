export type Story = { slug: string; title: string; summary: string; body: string }
export const stories: Story[] = [
  {
    slug: 'song-of-the-rainforest',
    title: 'Song of the Rainforest',
    summary: 'A girl follows a hummingbird to a hidden canopy.',
    body: `Deep in the canopy, a chorus of frogs kept time while leaves whispered like paper fans...`
  },
  {
    slug: 'desert-moon',
    title: 'Desert Moon',
    summary: 'A midnight hike reveals a blooming secret.',
    body: `The saguaro held the moon like a silver coin; somewhere, a cactus flower yawned open.`
  }
]
