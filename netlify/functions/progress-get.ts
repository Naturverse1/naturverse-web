import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { mustGet, err, okJson } from "./_env";

export const handler: Handler = async (event) => {
  const token = (event.headers["x-supabase-token"] || event.headers["X-Supabase-Token"]) as string | undefined;
  if (!token) return err(401, "Missing token");

  const client = createClient(mustGet("SUPABASE_URL"), token);
  const { data: authed } = await client.auth.getUser();
  const user_id = authed.user?.id;
  if (!user_id) return err(401, "Unauthorized");

  const [progress, streak, badges] = await Promise.all([
    client.from("user_quest_progress").select("quest_id, completed_at, started_at, last_action_at").order("last_action_at", { ascending: false }),
    client.from("user_streaks").select("*").maybeSingle(),
    client.from("user_badges").select("badge_code, earned_at").order("earned_at", { ascending: false })
  ]);

  if (progress.error) return err(500, progress.error.message);
  if (streak.error) return err(500, streak.error.message);
  if (badges.error) return err(500, badges.error.message);

  return okJson({
    progress: progress.data || [],
    streak: streak.data || { current_streak: 0, longest_streak: 0 },
    badges: badges.data || [],
  }, { "cache-control": "no-store" });
};
