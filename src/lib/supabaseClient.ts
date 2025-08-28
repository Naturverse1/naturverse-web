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
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient<Database> | undefined;

if (url && key) {
  _supabase = createClient<Database>(url, key);
} else {
  // Do not crash builds/environments missing env vars (e.g., permalink previews)
  // Production has these set, so this only affects fallback cases.
  console.warn(
    "[naturverse] Supabase env missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)"
  );
}

// keep the same named export that the app already uses
export const supabase = _supabase as SupabaseClient<Database>;
