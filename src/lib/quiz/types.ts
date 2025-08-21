export type MCOption = { id: string; text: string; correct?: boolean };
export type MCQuestion = {
  id: string;
  type: "mc";
  prompt: string;
  options: MCOption[];
  explanation?: string;
};

export type JeopardyCell = {
  id: string;
  points: number;
  question: string;
  answer: string;
  taken?: boolean;
};

export type JeopardyCategory = {
  id: string;
  title: string;
  cells: JeopardyCell[]; // arranged low→high points
};

export type Quiz =
  | { id: string; mode: "classic"; title: string; emoji?: string; questions: MCQuestion[] }
  | { id: string; mode: "jeopardy"; title: string; emoji?: string; board: JeopardyCategory[] };
