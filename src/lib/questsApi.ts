import { supabase } from "./supabaseClient";
import { SEED_QUESTS, type Quest } from "../data/quests";
import { listAllQuests, loadQuests, upsertQuest } from "../utils/quests-store";

function nowIso() { return new Date().toISOString(); }

function toAppQuest(row: any, steps: any[]): Quest {
  const ordered = [...steps].sort((a,b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    kingdom: row.kingdom ?? undefined,
    steps: ordered.map(s => ({
      id: s.step_id, text: s.text, tip: s.tip ?? undefined,
      minutes: typeof s.minutes === "number" ? s.minutes : undefined,
    })),
    rewards: [], // wire later
    createdAt: row.created_at ?? nowIso(),
    updatedAt: row.updated_at ?? nowIso(),
  };
}

export async function fetchAllQuests(): Promise<Quest[]> {
  try {
    const { data: qs, error } = await supabase.from("quests").select("*").order("updated_at", { ascending: false });
    if (error || !qs) throw error || new Error("No quests");
    const ids = qs.map(q => q.id);
    const { data: allSteps, error: sErr } = await supabase.from("quest_steps").select("*").in("quest_id", ids);
    if (sErr) throw sErr;
    const grouped = new Map<string, any[]>();
    (allSteps ?? []).forEach(s => {
      if (!grouped.has(s.quest_id)) grouped.set(s.quest_id, []);
      grouped.get(s.quest_id)!.push(s);
    });
    const mapped = qs.map(q => toAppQuest(q, grouped.get(q.id) ?? []));
    const local = loadQuests();
    const byId = new Map<string, Quest>();
    [...mapped, ...local].forEach(q => {
      const prev = byId.get(q.id);
      if (!prev || (q.updatedAt > prev.updatedAt)) byId.set(q.id, q);
    });
    return listAllQuests([...byId.values()]);
  } catch {
    return listAllQuests(SEED_QUESTS);
  }
}

export async function fetchQuestBySlug(slug: string): Promise<Quest | undefined> {
  try {
    const { data: q, error } = await supabase.from("quests").select("*").eq("slug", slug).maybeSingle();
    if (error || !q) throw error || new Error("Not found");
    const { data: steps } = await supabase.from("quest_steps").select("*").eq("quest_id", q.id);
    return toAppQuest(q, steps ?? []);
  } catch {
    return loadQuests().find(q => q.slug === slug) ?? SEED_QUESTS.find(q => q.slug === slug);
  }
}

export async function saveQuestToCloud(q: Quest): Promise<{ ok: boolean; conflict?: boolean; id?: string }> {
  upsertQuest(q);

  try {
    const { data: existing } = await supabase.from("quests").select("id, updated_at").eq("id", q.id).maybeSingle();

    if (existing) {
      if (existing.updated_at && existing.updated_at > q.updatedAt) {
        return { ok: false, conflict: true };
      }
      const { error: upErr } = await supabase.from("quests").update({
        title: q.title,
        summary: q.summary,
        kingdom: q.kingdom ?? null,
        slug: q.slug,
        updated_at: q.updatedAt,
      }).eq("id", q.id);
      if (upErr) throw upErr;

      await supabase.from("quest_steps").delete().eq("quest_id", q.id);
      const rows = q.steps.map((s, i) => ({
        quest_id: q.id, step_id: s.id, text: s.text, tip: s.tip ?? null, minutes: s.minutes ?? null, order_index: i,
      }));
      if (rows.length) {
        const { error: insErr } = await supabase.from("quest_steps").insert(rows);
        if (insErr) throw insErr;
      }
      return { ok: true, id: q.id };
    } else {
      const { error: insErr } = await supabase.from("quests").insert({
        id: q.id,
        slug: q.slug,
        title: q.title,
        summary: q.summary,
        kingdom: q.kingdom ?? null,
        created_at: q.createdAt,
        updated_at: q.updatedAt,
      });
      if (insErr) throw insErr;

      const rows = q.steps.map((s, i) => ({
        quest_id: q.id, step_id: s.id, text: s.text, tip: s.tip ?? null, minutes: s.minutes ?? null, order_index: i,
      }));
      if (rows.length) {
        const { error: sErr } = await supabase.from("quest_steps").insert(rows);
        if (sErr) throw sErr;
      }
      return { ok: true, id: q.id };
    }
  } catch (e) {
    console.warn("saveQuestToCloud failed; staying local", e);
    return { ok: false };
  }
}
