export type Choice = { id: string; text: string; goto: string };
export type Scene = { id: string; title: string; body: string; choices: Choice[] };
export type Story = {
  id: string;
  title: string;
  realm: string;
  emoji?: string;
  start: string; // scene id
  scenes: Scene[];
};
