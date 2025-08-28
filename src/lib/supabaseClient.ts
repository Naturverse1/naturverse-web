import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DbQuest = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kingdom: string | null;
  created_at: string;
  updated_at: string;
};
export type DbQuestStep = {
  id: string;
  quest_id: string;
  step_id: string;
  text: string;
  tip: string | null;
  minutes: number | null;
  order_index: number;
};

type Database = {
  public: {
    Tables: {
      quests: { Row: DbQuest; Insert: Partial<DbQuest>; Update: Partial<DbQuest>; Relationships: [] };
      quest_steps: { Row: DbQuestStep; Insert: Partial<DbQuestStep>; Update: Partial<DbQuestStep>; Relationships: [] };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient<Database> = createClient<Database>(url, anon);
