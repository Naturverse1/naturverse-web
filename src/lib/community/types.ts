export type Choice = { id: string; label: string; votes: number };
export type Poll = {
  id: string;
  title: string;
  notes?: string;
  choices: Choice[];
  createdAt: string; // ISO
};

export type BoardPost = {
  id: string;
  title: string;
  date?: string; // ISO
  location?: string;
  details?: string;
  rsvps: number;
  createdAt: string; // ISO
};
