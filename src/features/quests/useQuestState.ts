import { useCallback, useEffect, useMemo, useState } from "react";
import { addBadge, addStamp, grantNatur } from "@/utils/progress";

export type Quest = {
  id: string;
  title: string;
  world: string;
  rewardNatur: number;
  stamp: string;
};

const LS_ACTIVE = "natur:activeQuest";
const LS_LAST_DONE_DAY = "natur:lastQuestDay";
const LS_STREAK = "natur:streak";

type QuestDetail = {
  id?: unknown;
  title?: unknown;
  world?: unknown;
  rewardNatur?: unknown;
  stamp?: unknown;
};

type MarkStatus = "idle" | "marking";

type QuestEvent = CustomEvent<QuestDetail>;

const todayKey = () => new Date().toISOString().slice(0, 10);

const readJSON = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const writeJSON = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // ignore storage quota issues silently
  }
};

const readActiveQuest = (): Quest | null => {
  const data = readJSON<QuestDetail>(LS_ACTIVE);
  if (!data) return null;
  const parsed = normalizeQuest(data);
  return parsed;
};

const readLastCompletion = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LS_LAST_DONE_DAY);
  } catch {
    return null;
  }
};

const writeLastCompletion = (value: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_LAST_DONE_DAY, value);
  } catch {}
};

const readStreak = () => {
  if (typeof window === "undefined") return 0;
  const stored = window.localStorage.getItem(LS_STREAK);
  if (!stored) return 0;
  const num = Number(stored);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : 0;
};

const writeStreak = (value: number) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_STREAK, String(Math.max(0, Math.floor(value))));
  } catch {}
};

function normalizeQuest(raw: QuestDetail | null | undefined): Quest | null {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" ? raw.id : "";
  const title = typeof raw.title === "string" ? raw.title : "";
  const world = typeof raw.world === "string" ? raw.world : "";
  const stamp = typeof raw.stamp === "string" ? raw.stamp : world;
  const natur = Number((raw as QuestDetail).rewardNatur);
  if (!id || !title) return null;
  return {
    id,
    title,
    world: world || stamp || "Neighborhood",
    stamp: stamp || world || "Neighborhood",
    rewardNatur: Number.isFinite(natur) && natur > 0 ? Math.round(natur) : 0,
  };
}

function yesterdayKey(key: string) {
  const base = new Date(`${key}T00:00:00`);
  if (Number.isNaN(base.getTime())) return "";
  base.setDate(base.getDate() - 1);
  return base.toISOString().slice(0, 10);
}

export function useQuestState() {
  const [active, setActiveState] = useState<Quest | null>(() => readActiveQuest());
  const [streak, setStreak] = useState<number>(() => readStreak());
  const [completedToday, setCompletedToday] = useState<boolean>(() => readLastCompletion() === todayKey());
  const [feedback, setFeedback] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<MarkStatus>("idle");

  const setActive = useCallback((quest: Quest | null) => {
    setActiveState(quest);
    if (quest) {
      writeJSON(LS_ACTIVE, quest);
      setCompletedToday(readLastCompletion() === todayKey());
    } else {
      writeJSON(LS_ACTIVE, null);
      setCompletedToday(false);
    }
    setFeedback("");
    setSyncMessage("");
    setError("");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: Event) => {
      const quest = normalizeQuest((event as QuestEvent).detail);
      if (!quest) return;
      setActive(quest);
    };
    window.addEventListener("natur:quest:accepted", handler);
    return () => window.removeEventListener("natur:quest:accepted", handler);
  }, [setActive]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const last = readLastCompletion();
    if (last && last !== todayKey()) {
      const stored = readStreak();
      if (stored !== streak) setStreak(stored);
    }
  }, [streak]);

  const markComplete = useCallback(async () => {
    if (!active || status === "marking" || completedToday) return;
    setStatus("marking");
    setError("");
    setFeedback("");
    setSyncMessage("");

    try {
      const [naturResult, stampResult, badgeResult] = await Promise.all([
        grantNatur(active.rewardNatur, `Quest: ${active.title}`),
        addStamp(active.world, active.title),
        addBadge(active.world),
      ]);

      const detailParts: string[] = [];
      if (active.rewardNatur > 0) {
        detailParts.push(`+${active.rewardNatur} NATUR`);
      }
      if (active.stamp) {
        detailParts.push(`Stamp: ${active.stamp}`);
      }
      if (badgeResult.award) {
        detailParts.push(`${badgeResult.award.emoji} ${badgeResult.award.label}`);
      }
      if (detailParts.length) {
        setFeedback(detailParts.join(" • "));
      }

      const statuses = [naturResult.status, stampResult.status, badgeResult.status];
      const allRemote = statuses.every((state) => state === "remote" || state === "noop");
      setSyncMessage(
        allRemote
          ? "Synced to NaturBank and Passport."
          : "Saved locally — sign in to sync later."
      );

      const last = readLastCompletion();
      const today = todayKey();
      const storedStreak = readStreak();
      let nextStreak = storedStreak > 0 ? storedStreak : streak;
      if (last === today) {
        nextStreak = storedStreak || streak || 1;
      } else if (last && last === yesterdayKey(today)) {
        nextStreak = (storedStreak || streak) + 1;
      } else {
        nextStreak = 1;
      }
      setStreak(nextStreak);
      writeStreak(nextStreak);
      setCompletedToday(true);
      writeLastCompletion(today);

      try {
        writeJSON(LS_ACTIVE, active);
      } catch {}

      try {
        window.dispatchEvent(
          new CustomEvent("natur:reward", {
            detail: { natur: active.rewardNatur, note: `Quest: ${active.title}` },
          })
        );
      } catch {}

      try {
        window.dispatchEvent(
          new CustomEvent("natur:stamp", {
            detail: { world: active.world, note: "Quest completed with Turian" },
          })
        );
      } catch {}

      try {
        window.dispatchEvent(new CustomEvent("natur:confetti"));
      } catch {}
    } catch (err) {
      console.error("quest:markComplete failed", err);
      setError("Whoops! Turian couldn't record that quest just now. Try again in a moment.");
    } finally {
      setStatus("idle");
    }
  }, [active, completedToday, status, streak]);

  return useMemo(
    () => ({
      active,
      streak,
      completedToday,
      feedback,
      syncMessage,
      error,
      marking: status === "marking",
      setActive,
      markComplete,
    }),
    [
      active,
      streak,
      completedToday,
      feedback,
      syncMessage,
      error,
      status,
      setActive,
      markComplete,
    ]
  );
}
