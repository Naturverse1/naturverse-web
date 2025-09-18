import { FormEvent, useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useToast } from "../../components/Toast";
import { callAI } from "@/lib/ai";
import { naturEvent } from "@/lib/events";
import { LessonPlan, saveLessonPlan, loadLessonPlan, listLessonPlans } from "@/lib/localdb";
import { setTitle } from "../_meta";
import "../../styles/lesson-builder.css";

type LessonQuizResponse = {
  q?: string;
  question?: string;
  options?: unknown;
  choices?: unknown;
  answers?: unknown;
  answer?: string;
  a?: string;
  correct?: string;
};

type LessonResponse = {
  title?: string;
  intro?: string;
  outline?: unknown;
  activities?: unknown;
  quiz?: LessonQuizResponse[] | { questions?: LessonQuizResponse[] };
};

const DEFAULT_PLAN: LessonPlan = {
  title: "",
  intro: "",
  outline: [],
  activities: [],
  quiz: [],
};

export default function LessonBuilderPage() {
  setTitle("Lesson Builder");
  const toast = useToast();
  const aiEnabled = import.meta.env.PROD || import.meta.env.VITE_ENABLE_AI === "true";
  const [topic, setTopic] = useState("");
  const [age, setAge] = useState("8");
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  const numericAge = useMemo(() => {
    const value = Number(age);
    if (Number.isFinite(value)) return Math.min(18, Math.max(3, Math.round(value)));
    return 0;
  }, [age]);

  useEffect(() => {
    const [recent] = listLessonPlans();
    if (recent) {
      setTopic(recent.topic);
      setAge(String(recent.age));
      setPlan(recent.plan);
    }
  }, []);

  useEffect(() => {
    if (!topic.trim() || numericAge === 0) return;
    const stored = loadLessonPlan(topic, numericAge);
    if (stored) setPlan(stored);
  }, [topic, numericAge]);

  const ensureCooldown = () => {
    const now = Date.now();
    if (now < cooldownUntil) {
      toast({ text: "Let Turian wrap up the last lesson first.", kind: "warn" });
      return false;
    }
    setCooldownUntil(now + 3000);
    return true;
  };

  const sanitizePlan = (input: LessonResponse): LessonPlan => {
    const sanitizeString = (value: unknown, limit = 320) => String(value ?? "").trim().slice(0, limit);
    const sanitizeList = (value: unknown, limit: number) =>
      Array.isArray(value)
        ? value
            .slice(0, limit)
            .map((item) => sanitizeString(item))
            .filter(Boolean)
        : [];
    const includesInsensitive = (list: string[], value: string) =>
      list.some((item) => item.localeCompare(value, undefined, { sensitivity: "accent" }) === 0);
    const sanitizeOptions = (value: unknown) => {
      const source = Array.isArray(value)
        ? value
        : value && typeof value === "object"
        ? Object.values(value as Record<string, unknown>)
        : [];

      const options: string[] = [];
      for (const entry of source) {
        const text = sanitizeString(entry, 160);
        if (!text) continue;
        if (!includesInsensitive(options, text)) options.push(text);
        if (options.length >= 4) break;
      }
      return options;
    };

    const quizSource = Array.isArray(input.quiz)
      ? input.quiz
      : input.quiz && typeof input.quiz === "object" && Array.isArray(input.quiz.questions)
      ? input.quiz.questions
      : [];

    const quiz = quizSource
      .slice(0, 3)
      .map((item) => {
        if (item && typeof item === "object") {
          const record = item as LessonQuizResponse;
          const q = sanitizeString(record.q ?? record.question, 320);
          const options = sanitizeOptions(record.options ?? record.choices ?? record.answers);
          let answer = sanitizeString(record.answer ?? record.a ?? record.correct ?? "", 160);

          if (/^[A-D]$/i.test(answer) && options.length > 0) {
            const idx = answer.toUpperCase().charCodeAt(0) - 65;
            if (options[idx]) answer = options[idx];
          }

          if (answer) {
            if (!includesInsensitive(options, answer)) {
              if (options.length >= 4) options[options.length - 1] = answer;
              else options.push(answer);
            }
          }

          const resolvedAnswer = answer || options[0] || "";
          return { q, options, answer: resolvedAnswer };
        }

        const q = sanitizeString(item, 320);
        return { q, options: [] as string[], answer: "" };
      })
      .filter((entry) => entry.q.length > 0);

    return {
      title: sanitizeString(input.title, 160),
      intro: sanitizeString(input.intro, 480),
      outline: sanitizeList(input.outline, 3),
      activities: sanitizeList(input.activities, 2),
      quiz,
    };
  };

  async function buildLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!aiEnabled) return;

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("Enter a topic first.");
      return;
    }
    if (numericAge <= 0) {
      setError("Enter an age between 3 and 18.");
      return;
    }
    if (!ensureCooldown()) return;

    setBusy(true);
    setError(null);
    try {
      const response = await callAI<LessonResponse>("naturversity.lesson", {
        topic: trimmedTopic,
        age: numericAge,
      });
      const built = sanitizePlan(response);
      const stored = saveLessonPlan(trimmedTopic, numericAge, { ...DEFAULT_PLAN, ...built });
      const finalized = stored?.plan ?? built;
      setPlan(finalized);
      toast({ text: "Lesson ready!" });
      naturEvent("grant_natur", { amount: 5, note: `Lesson: ${finalized.title || trimmedTopic}` });
      naturEvent("passport_stamp", { world: "Learning", note: finalized.title || trimmedTopic });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not build that lesson.";
      setError(message);
      toast({ text: message, kind: "err" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-wrap">
      <Breadcrumbs />
      <main className="lesson-builder" id="main">
        <h1>Lesson Builder</h1>
        <p className="lead">Co-create a Naturversity mini-lesson with Turian.</p>

        {!aiEnabled ? (
          <p className="muted">AI helpers are disabled for this build.</p>
        ) : (
          <form className="lesson-form" onSubmit={buildLesson}>
            <label>
              Topic
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Rainforest animals, pollination, constellations…"
              />
            </label>
            <label className="lesson-age">
              Age
              <input
                type="number"
                min={3}
                max={18}
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
            </label>
            <button type="submit" className="lesson-btn" disabled={busy}>
              {busy ? (
                <>
                  <span className="spinner spinner-inline" aria-hidden="true" /> Building…
                </>
              ) : (
                "Build lesson"
              )}
            </button>
            <p className="hint">We store plans locally so you can revisit them later.</p>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}

        <section className="lesson-output" aria-live="polite">
          {plan ? (
            <>
              <header className="lesson-output__header">
                <h2>{plan.title || "Lesson preview"}</h2>
                <div className="lesson-output__meta">Designed for age {numericAge || age || "8"}</div>
              </header>
              <p className="lesson-output__intro">{plan.intro || "Your intro will appear here."}</p>

              <div className="lesson-output__grid">
                <div className="lesson-output__card">
                  <h3>Outline</h3>
                  {plan.outline.length ? (
                    <ul>
                      {plan.outline.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="placeholder">3 bullet points appear here.</p>
                  )}
                </div>
                <div className="lesson-output__card">
                  <h3>Activities</h3>
                  {plan.activities.length ? (
                    <ol>
                      {plan.activities.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="placeholder">Hands-on prompts land here.</p>
                  )}
                </div>
              </div>

              <section className="lesson-quiz">
                <h3>Quiz</h3>
                {plan.quiz.length ? (
                  <ol className="lesson-quiz__list">
                    {plan.quiz.map((item, index) => {
                      const hasAnswerOption = item.options.some(
                        (option) => option.localeCompare(item.answer, undefined, { sensitivity: "accent" }) === 0
                      );
                      return (
                        <li key={`${item.q}-${index}`} className="lesson-quiz__item">
                          <div className="lesson-quiz__prompt">{item.q}</div>
                          {item.options.length ? (
                            <ul className="lesson-quiz__options">
                              {item.options.map((option, optIndex) => {
                                const isAnswer = option.localeCompare(item.answer, undefined, { sensitivity: "accent" }) === 0;
                                return (
                                  <li
                                    key={`${option}-${optIndex}`}
                                    className={`lesson-quiz__option${isAnswer ? " lesson-quiz__option--answer" : ""}`}
                                  >
                                    <span className="lesson-quiz__option-label">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <span>{option}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                          {item.answer && !hasAnswerOption ? (
                            <div className="lesson-quiz__answer-note">Answer: {item.answer}</div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="placeholder">Three check-in questions will show here.</p>
                )}
              </section>

              <aside className="lesson-reward" aria-live="polite">
                <div className="lesson-reward__pill">+5 NATUR</div>
                <div className="lesson-reward__note">Learning passport stamp awarded</div>
              </aside>
            </>
          ) : (
            <p className="placeholder">Build a lesson to see the outline, activities, and quiz.</p>
          )}
        </section>
      </main>
    </div>
  );
}
