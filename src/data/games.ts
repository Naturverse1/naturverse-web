export type Game = { id: string; title: string; description: string; url?: string }
export const games: Game[] = [
  { id: 'sapling-sprint', title: 'Sapling Sprint', description: 'Tap to dodge the stumps and grow your tree!' },
  { id: 'pollinator-pop', title: 'Pollinator Pop', description: 'Match flowers to help bees gather nectar.' },
  { id: 'river-run', title: 'River Run', description: 'Steer your raft, collect leaves, avoid rocks.' },
]
