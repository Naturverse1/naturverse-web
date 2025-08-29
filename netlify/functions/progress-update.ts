import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function updateStreak(prev: { current_streak: number; longest_streak: number; last_completed_date: string | null }) {
  const today = new Date().toISOString().slice(0,10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  const last = prev.last_completed_date;
  let current = prev.current_streak || 0;
  if (!last || (last !== today && last !== yesterday)) current = 0;
  if (last !== today) current += 1;
  const longest = Math.max(prev.longest_streak || 0, current);
  return { current, longest, today };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const token = (event.headers["x-supabase-token"] || event.headers["X-Supabase-Token"]) as string | undefined;
  if (!token) return { statusCode: 401, body: "Missing auth token" };

  const client = createClient(process.env.SUPABASE_URL!, token);
  const { data: authed } = await client.auth.getUser();
  const user_id = authed.user?.id;
  if (!user_id) return { statusCode: 401, body: "Unauthorized" };

  const { quest_id, action } = JSON.parse(event.body || "{}") as { quest_id: string; action: "start" | "complete" };
  if (!quest_id || !["start", "complete"].includes(action)) return { statusCode: 400, body: "Bad input" };

  const now = new Date().toISOString();
  const patch: any = { last_action_at: now };
  if (action === "start") patch.started_at = patch.started_at ?? now;
  if (action === "complete") patch.completed_at = now;

  const { error: upErr } = await supabase.from("user_quest_progress").upsert(
    { user_id, quest_id, ...patch },
    { onConflict: "user_id,quest_id" }
  );
  if (upErr) return { statusCode: 500, body: upErr.message };

  if (action === "complete") {
    const { data: prev } = await supabase.from("user_streaks").select("*").eq("user_id", user_id).maybeSingle();
    const streak = updateStreak({
      current_streak: prev?.current_streak ?? 0,
      longest_streak: prev?.longest_streak ?? 0,
      last_completed_date: prev?.last_completed_date ?? null,
    });

    if (prev) {
      await supabase.from("user_streaks").update({
        current_streak: streak.current,
        longest_streak: streak.longest,
        last_completed_date: streak.today,
      }).eq("user_id", user_id);
    } else {
      await supabase.from("user_streaks").insert({
        user_id, current_streak: streak.current, longest_streak: streak.longest, last_completed_date: streak.today
      });
    }

    const badgesToTry: string[] = [];
    const { count } = await supabase.from("user_quest_progress").select("*", { count: "exact", head: true })
      .eq("user_id", user_id).not("completed_at", "is", null);
    if ((count || 0) === 1) badgesToTry.push("FIRST_QUEST");
    if (streak.current === 3) badgesToTry.push("STREAK_3");
    if (streak.current === 7) badgesToTry.push("STREAK_7");
    if (streak.current === 30) badgesToTry.push("STREAK_30");

    if (badgesToTry.length) {
      await supabase.from("user_badges").upsert(
        badgesToTry.map(code => ({ user_id, badge_code: code })),
        { onConflict: "user_id,badge_code", ignoreDuplicates: true } as any
      );
    }
  }

  return { statusCode: 200, body: "ok" };
};
