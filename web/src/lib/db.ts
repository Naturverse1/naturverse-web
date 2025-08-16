import { supabase } from "@/supabaseClient";

export async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

/** STORIES **/
export async function saveStory(params: {
  title: string;
  prompt?: string;
  content: string;
}) {
  const user_id = await getUserId();
  const { error } = await supabase.from("stories").insert([{ user_id, ...params }]);
  if (error) throw error;
}

export type StoryListItem = {
  id: string;
  title: string;
  created_at: string;
  words: number | null;
};

export async function listStories(limit = 20): Promise<StoryListItem[]> {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from("stories")
    .select("id,title,created_at,words")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as StoryListItem[];
}

/** QUIZ **/
export async function saveQuizAttempt(params: {
  zone: string;
  unit: string;
  questions: unknown;
  answers: unknown;
  score: number;
  max_score: number;
}) {
  const user_id = await getUserId();
  const { error } = await supabase
    .from("quiz_attempts")
    .insert([{ user_id, ...params }]);
  if (error) throw error;
}

/** PROGRESS **/
export async function setProgress(
  zone: string,
  unit: string,
  status: "incomplete" | "complete",
) {
  const user_id = await getUserId();
  const { error } = await supabase.from("progress").upsert({
    user_id,
    zone,
    unit,
    status,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export type ProgressRow = { unit: string; status: string; updated_at: string };

export async function getProgress(zone: string): Promise<ProgressRow[]> {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from("progress")
    .select("unit,status,updated_at")
    .eq("user_id", user_id)
    .eq("zone", zone);
  if (error) throw error;
  return (data ?? []) as ProgressRow[];
}
