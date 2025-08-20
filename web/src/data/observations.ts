export type Observation = { id:string; title:string; note:string; when:string }
export const observations: Observation[] = [
  { id:'obs1', title:'Cloud Parade', note:'Saw altocumulus like fish scales at dusk.', when: new Date().toISOString() },
  { id:'obs2', title:'New Sprout', note:'Mint cutting made tiny roots!', when: new Date().toISOString() },
]
