import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { DateTime } from "luxon";
import { mustGet, err } from "./_env";

const srv = () => createClient(mustGet("SUPABASE_URL"), mustGet("SUPABASE_SERVICE_ROLE_KEY"));

function updateStreak(prev: { current_streak: number; longest_streak: number; last_completed_date: string | null }) {
  const today = DateTime.utc().toISODate()!;
  const yesterday = DateTime.utc().minus({ days: 1 }).toISODate()!;
  const last = prev.last_completed_date;
  let current = prev.current_streak || 0;
  if (!last || (last !== today && last !== yesterday)) current = 0;
  if (last !== today) current += 1;
  const longest = Math.max(prev.longest_streak || 0, current);
  return { current, longest, today };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return err(405, "Method Not Allowed");

  const token = (event.headers["x-supabase-token"] || event.headers["X-Supabase-Token"]) as string | undefined;
  if (!token) return err(401, "Missing auth token");

  const client = createClient(mustGet("SUPABASE_URL"), token);
  const { data: authed } = await client.auth.getUser();
  const user_id = authed.user?.id;
  if (!user_id) return err(401, "Unauthorized");

  const { quest_id, action } = JSON.parse(event.body || "{}") as { quest_id?: string; action?: "start"|"complete" };
  if (!quest_id || !action) return err(400, "Bad input");

  const supabase = srv();
  const now = new Date().toISOString();
  const patch: any = { last_action_at: now };
  if (action === "start") patch.started_at = now;
  if (action === "complete") patch.completed_at = now;

  const up = await supabase.from("user_quest_progress").upsert(
    { user_id, quest_id, ...patch },
    { onConflict: "user_id,quest_id" }
  );
  if (up.error) return err(500, up.error.message);

  if (action === "complete") {
    const prev = await supabase.from("user_streaks").select("*").eq("user_id", user_id).maybeSingle();
    if (prev.error) return err(500, prev.error.message);
    const st = updateStreak({
      current_streak: prev.data?.current_streak ?? 0,
      longest_streak: prev.data?.longest_streak ?? 0,
      last_completed_date: prev.data?.last_completed_date ?? null,
    });
    if (prev.data) {
      const u = await supabase.from("user_streaks").update({
        current_streak: st.current, longest_streak: st.longest, last_completed_date: st.today
      }).eq("user_id", user_id);
      if (u.error) return err(500, u.error.message);
    } else {
      const ins = await supabase.from("user_streaks").insert({
        user_id, current_streak: st.current, longest_streak: st.longest, last_completed_date: st.today
      });
      if (ins.error) return err(500, ins.error.message);
    }

    // badges
    const count = await supabase
      .from("user_quest_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .not("completed_at", "is", null);
    if (count.error) return err(500, count.error.message);

    const toBadge: string[] = [];
    if ((count.count || 0) === 1) toBadge.push("FIRST_QUEST");
    if (st.current === 3) toBadge.push("STREAK_3");
    if (st.current === 7) toBadge.push("STREAK_7");
    if (st.current === 30) toBadge.push("STREAK_30");
    if (toBadge.length) {
      const upb = await supabase.from("user_badges").upsert(
        toBadge.map(code => ({ user_id, badge_code: code })), { onConflict: "user_id,badge_code" } as any
      );
      if (upb.error) return err(500, upb.error.message);
    }
  }

  return { statusCode: 200, body: "ok" };
};
