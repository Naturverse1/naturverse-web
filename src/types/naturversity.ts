export type StudentProgress = {
  id: string;
  student_id: string;
  quiz_id: string;
  score: number;
  created_at: string;
};

export type ParentControls = {
  id: string;
  child_id: string;
  content_locked: boolean;
  spending_limit: number | null;
  updated_at: string;
};

export type DaoProposal = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
};
