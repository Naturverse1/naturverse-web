export type NavatarCardDraft = {
  description: string;
  name: string;
  species: string;
  kingdom: string;
  backstory: string;
  powers: string;
  traits: string;
};

export type LessonQuizItem = { q: string; a: string };
export type LessonPlan = {
  title: string;
  intro: string;
  outline: string[];
  activities: string[];
  quiz: LessonQuizItem[];
};

type StoredPlan = {
  topic: string;
  age: number;
  plan: LessonPlan;
  savedAt: number;
};

const NAVATAR_DRAFT_KEY = "naturverse.navatar.card.v1";
const LESSON_PLANS_KEY = "naturverse.ai.lessonPlans.v1";

const NAVATAR_DEFAULT: NavatarCardDraft = {
  description: "",
  name: "",
  species: "",
  kingdom: "",
  backstory: "",
  powers: "",
  traits: "",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function readNavatarDraft(): NavatarCardDraft {
  const draft = readJson<Partial<NavatarCardDraft>>(NAVATAR_DRAFT_KEY, {});
  return { ...NAVATAR_DEFAULT, ...draft };
}

export function saveNavatarDraft(partial: Partial<NavatarCardDraft>): NavatarCardDraft {
  const merged = { ...readNavatarDraft(), ...partial };
  writeJson(NAVATAR_DRAFT_KEY, merged);
  return merged;
}

export function clearNavatarDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(NAVATAR_DRAFT_KEY);
  } catch {}
}

function sanitizeLessonPlan(plan: LessonPlan): LessonPlan {
  const sanitizeString = (value: unknown, limit = 320) => String(value ?? "").trim().slice(0, limit);
  const sanitizeList = (value: unknown[], limit: number) =>
    value
      .slice(0, limit)
      .map((item) => sanitizeString(item))
      .filter((item) => item.length > 0);

  const quiz = Array.isArray(plan.quiz)
    ? plan.quiz
        .slice(0, 3)
        .map((item) => ({
          q: sanitizeString(item?.q, 320),
          a: sanitizeString(item?.a, 320),
        }))
        .filter((entry) => entry.q.length > 0)
    : [];

  return {
    title: sanitizeString(plan.title, 160),
    intro: sanitizeString(plan.intro, 480),
    outline: Array.isArray(plan.outline) ? sanitizeList(plan.outline, 3) : [],
    activities: Array.isArray(plan.activities) ? sanitizeList(plan.activities, 2) : [],
    quiz,
  };
}

function clampAge(age: number) {
  if (!Number.isFinite(age)) return 0;
  const safe = Math.round(age);
  if (safe < 3) return 3;
  if (safe > 18) return 18;
  return safe;
}

function readLessonPlans(): StoredPlan[] {
  const list = readJson<StoredPlan[]>(LESSON_PLANS_KEY, []);
  if (!Array.isArray(list)) return [];
  return list
    .map((entry) => {
      const topic = String(entry?.topic ?? "").trim();
      const age = clampAge(Number(entry?.age ?? 0));
      const plan = sanitizeLessonPlan(entry?.plan ?? ({} as LessonPlan));
      const savedAt = Number(entry?.savedAt ?? Date.now());
      return { topic, age, plan, savedAt };
    })
    .filter((entry) => entry.topic.length > 0 && entry.age > 0);
}

function writeLessonPlans(list: StoredPlan[]) {
  writeJson(LESSON_PLANS_KEY, list);
}

export function saveLessonPlan(topic: string, age: number, plan: LessonPlan): StoredPlan | null {
  const cleanTopic = topic.trim().slice(0, 160);
  const cleanAge = clampAge(age);
  if (!cleanTopic || cleanAge <= 0) return null;
  const sanitized = sanitizeLessonPlan(plan);
  const entry: StoredPlan = {
    topic: cleanTopic,
    age: cleanAge,
    plan: sanitized,
    savedAt: Date.now(),
  };
  const list = readLessonPlans().filter((item) => !(item.topic === cleanTopic && item.age === cleanAge));
  list.unshift(entry);
  writeLessonPlans(list.slice(0, 20));
  return entry;
}

export function loadLessonPlan(topic: string, age: number): LessonPlan | null {
  const cleanTopic = topic.trim().slice(0, 160);
  const cleanAge = clampAge(age);
  if (!cleanTopic || cleanAge <= 0) return null;
  const match = readLessonPlans().find((item) => item.topic === cleanTopic && item.age === cleanAge);
  return match ? match.plan : null;
}

export function listLessonPlans(): StoredPlan[] {
  return readLessonPlans();
}
