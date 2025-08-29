import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const handler: Handler = async (event) => {
  const token = (event.headers["x-supabase-token"] || event.headers["X-Supabase-Token"]) as string | undefined;
  if (!token) return { statusCode: 401, body: "Missing token" };

  const client = createClient(process.env.SUPABASE_URL!, token);
  const { data: authed } = await client.auth.getUser();
  const user_id = authed.user?.id;
  if (!user_id) return { statusCode: 401, body: "Unauthorized" };

  const [progress, streak, badges] = await Promise.all([
    client.from("user_quest_progress").select("quest_id, completed_at, started_at, last_action_at").order("last_action_at", { ascending: false }),
    client.from("user_streaks").select("*").maybeSingle(),
    client.from("user_badges").select("badge_code, earned_at").order("earned_at", { ascending: false })
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      progress: progress.data || [],
      streak: streak.data || { current_streak: 0, longest_streak: 0 },
      badges: badges.data || [],
    })
  };
};
