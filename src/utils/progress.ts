import { supabase } from "@/lib/supabaseClient";
import { demoGrant } from "@/lib/naturbank";
import { demoAddStamp } from "@/lib/passport";
import {
  addBadge as addLocalBadge,
  getBadges as getLocalBadges,
} from "@/lib/passport/store";
import type { PassportStamp } from "@/types/passport";

export type ProgressSource = "remote" | "local" | "noop";

export type GrantNaturResult = {
  status: ProgressSource;
};

export type StampResult = {
  status: ProgressSource;
  stamp?: PassportStamp | null;
};

export type BadgeLevel = "bronze" | "silver" | "gold";

export type BadgeAward = {
  level: BadgeLevel;
  label: string;
  emoji: string;
  threshold: number;
};

export type BadgeResult = {
  status: ProgressSource;
  award?: BadgeAward;
};

const BADGE_LABELS: Record<BadgeLevel, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

const BADGE_LEVEL_CONFIG: Record<BadgeLevel, { threshold: number; emoji: string }> = {
  bronze: { threshold: 3, emoji: "🥉" },
  silver: { threshold: 6, emoji: "🥈" },
  gold: { threshold: 10, emoji: "🥇" },
};

const BADGE_LEVELS: BadgeLevel[] = ["bronze", "silver", "gold"];

const REGION_THRESHOLD_OVERRIDES: Record<string, Partial<Record<BadgeLevel, number>>> = {
  Neighborhood: { bronze: 3, silver: 6, gold: 10 },
  Skywatch: { bronze: 3, silver: 6, gold: 10 },
  Creative: { bronze: 3, silver: 6, gold: 10 },
  Learning: { bronze: 3, silver: 6, gold: 10 },
  Adventure: { bronze: 3, silver: 6, gold: 10 },
  Fun: { bronze: 3, silver: 6, gold: 10 },
};

const LOCAL_STAMP_KEY = "naturverse.passport.stamps.v1";

async function getCurrentUserId() {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch (error) {
    console.warn("progress:getSession failed", error);
    return null;
  }
}

function sanitizeNote(note: string) {
  const trimmed = note.trim();
  return trimmed.length ? trimmed : "Turian quest reward";
}

function dispatchStampEvent(world: string, stamp: PassportStamp | null | undefined) {
  if (typeof window === "undefined" || !stamp) return;
  try {
    window.dispatchEvent(new CustomEvent("natur:stamp-granted", { detail: { world, stamp } }));
  } catch {}
}

function readLocalStamps(): PassportStamp[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STAMP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as PassportStamp[];
  } catch (error) {
    console.warn("progress:readLocalStamps failed", error);
    return [];
  }
}

function slugifyRegion(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "quest";
}

function buildBadgeLabel(region: string, level: BadgeLevel) {
  return `${region} ${BADGE_LABELS[level]} Badge`;
}

function resolveThreshold(region: string, level: BadgeLevel) {
  return REGION_THRESHOLD_OVERRIDES[region]?.[level] ?? BADGE_LEVEL_CONFIG[level].threshold;
}

type BadgeComputation = {
  level: BadgeLevel;
  threshold: number;
  emoji: string;
};

function determineBadge(region: string, count: number): BadgeComputation | null {
  if (count <= 0) return null;
  let unlocked: BadgeComputation | null = null;
  for (const level of BADGE_LEVELS) {
    const threshold = resolveThreshold(region, level);
    if (count >= threshold) {
      unlocked = { level, threshold, emoji: BADGE_LEVEL_CONFIG[level].emoji };
    }
  }
  return unlocked;
}

function createBadgeCode(region: string, level: BadgeLevel) {
  const slug = slugifyRegion(region);
  return `turian-${slug}-${level}`;
}

function toBadgeAward(region: string, computation: BadgeComputation): BadgeAward {
  return {
    level: computation.level,
    label: buildBadgeLabel(region, computation.level),
    emoji: computation.emoji,
    threshold: computation.threshold,
  };
}

function addBadgeLocal(region: string): BadgeResult {
  try {
    const stamps = readLocalStamps();
    const count = stamps.reduce((total, stamp) => (stamp.world === region ? total + 1 : total), 0);
    const unlocked = determineBadge(region, count);
    if (!unlocked) return { status: "noop" };

    const code = createBadgeCode(region, unlocked.level);
    const existing = getLocalBadges().some((badge) => badge.id === code);
    if (existing) return { status: "noop" };

    const award = toBadgeAward(region, unlocked);
    addLocalBadge({
      id: code,
      title: award.label,
      emoji: award.emoji,
      desc: `Earned by completing ${award.threshold}+ ${region.toLowerCase()} quests.`,
    });
    return { status: "local", award };
  } catch (error) {
    console.error("progress:addBadge local fallback failed", error);
    throw error;
  }
}

async function addBadgeRemote(region: string, userId: string): Promise<BadgeResult> {
  const { count, error: countError } = await supabase
    .from("passport_stamps")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("world", region);
  if (countError) throw countError;

  const unlocked = determineBadge(region, count ?? 0);
  if (!unlocked) return { status: "noop" };

  const code = createBadgeCode(region, unlocked.level);
  const { data: existing, error: existingError } = await supabase
    .from("passport_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("code", code)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return { status: "noop" };

  const award = toBadgeAward(region, unlocked);
  const { error: insertError } = await supabase
    .from("passport_badges")
    .insert({ user_id: userId, code, label: award.label });
  if (insertError) throw insertError;

  return { status: "remote", award };
}

export async function grantNatur(amount: number, note: string): Promise<GrantNaturResult> {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  if (safeAmount <= 0) return { status: "noop" };
  const entryNote = sanitizeNote(note);

  try {
    const userId = await getCurrentUserId();
    if (userId) {
      const { error } = await supabase.rpc("earn_spend_natur", {
        p_kind: "earn",
        p_amount: safeAmount,
        p_meta: { source: "turian-quest", note: entryNote },
      });
      if (error) throw error;
      return { status: "remote" };
    }
  } catch (error) {
    console.warn("progress:grantNatur remote failed", error);
  }

  try {
    demoGrant(safeAmount, entryNote);
    return { status: "local" };
  } catch (error) {
    console.error("progress:grantNatur local fallback failed", error);
    throw error;
  }
}

export async function addStamp(region: string, questTitle: string): Promise<StampResult> {
  const world = region.trim();
  if (!world) return { status: "noop" };
  const title = questTitle.trim() || "Turian Quest";
  const note = `Quest: ${title}`;

  try {
    const userId = await getCurrentUserId();
    if (userId) {
      const { data, error } = await supabase
        .from("passport_stamps")
        .insert({ user_id: userId, world, title, note })
        .select("id,user_id,world,title,note,created_at")
        .single();
      if (error) throw error;
      const stamp = data as PassportStamp;
      dispatchStampEvent(world, stamp);
      return { status: "remote", stamp };
    }
  } catch (error) {
    console.warn("progress:addStamp remote failed", error);
  }

  try {
    const stamp = demoAddStamp(world, title);
    if (!stamp) return { status: "noop" };
    return { status: "local", stamp };
  } catch (error) {
    console.error("progress:addStamp local fallback failed", error);
    throw error;
  }
}

export async function addBadge(region: string): Promise<BadgeResult> {
  const trimmed = region.trim();
  if (!trimmed) return { status: "noop" };

  try {
    const userId = await getCurrentUserId();
    if (userId) {
      return await addBadgeRemote(trimmed, userId);
    }
  } catch (error) {
    console.warn("progress:addBadge remote failed", error);
  }

  return addBadgeLocal(trimmed);
}
