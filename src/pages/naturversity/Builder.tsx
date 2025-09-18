import { FormEvent, useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useToast } from "../../components/Toast";
import { callAI } from "@/lib/ai";
import { naturEvent } from "@/lib/events";
import { LessonPlan, saveLessonPlan, loadLessonPlan, listLessonPlans } from "@/lib/localdb";
import { setTitle } from "../_meta";
import "../../styles/lesson-builder.css";

type LessonResponse = {
  title?: string;
  intro?: string;
  outline?: string[];
  activities?: string[];
  quiz?: { q: string; a: string }[];
};

type QuizResponse = {
  questions: {
    q: string;
    options: [string, string, string, string];
    answer: "A" | "B" | "C" | "D";
  }[];
};

const ANSWER_LETTERS = ["A", "B", "C", "D"] as const;

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
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
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
      setQuiz(null);
    }
  }, []);

  useEffect(() => {
    if (!topic.trim() || numericAge === 0) return;
    const stored = loadLessonPlan(topic, numericAge);
    setQuiz(null);
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

  const safeParse = <T,>(input: string): T | null => {
    try {
      return JSON.parse(input) as T;
    } catch {
      return null;
    }
  };

  const extractMessage = (error: unknown, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (typeof (error as any)?.message === "string") return (error as any).message;
    if (typeof (error as any)?.error === "string") return (error as any).error;
    if (typeof (error as any)?.error?.message === "string") return (error as any).error.message;
    return fallback;
  };

  const sanitizePlan = (input: LessonResponse): LessonPlan => ({
    title: String(input.title ?? "").trim(),
    intro: String(input.intro ?? "").trim(),
    outline: Array.isArray(input.outline)
      ? input.outline
          .slice(0, 3)
          .map(item => String(item ?? "").trim())
          .filter(Boolean)
      : [],
    activities: Array.isArray(input.activities)
      ? input.activities
          .slice(0, 2)
          .map(item => String(item ?? "").trim())
          .filter(Boolean)
      : [],
    quiz: Array.isArray(input.quiz)
      ? input.quiz
          .slice(0, 3)
          .map((item) => ({
            q: String(item?.q ?? "").trim(),
            a: String(item?.a ?? "").trim(),
          }))
          .filter((item) => item.q.length > 0)
      : [],
  });

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
      const response = await callAI<LessonResponse>(
        "lesson",
        `Topic: ${trimmedTopic}\nAge: ${numericAge}`
      );
      const built = sanitizePlan(response);
      setQuiz(null);
      const stored = saveLessonPlan(trimmedTopic, numericAge, { ...DEFAULT_PLAN, ...built });
      const finalized = stored?.plan ?? built;
      setPlan(finalized);
      toast({ text: "Lesson ready!" });
      naturEvent("grant_natur", { amount: 5, note: `Lesson: ${finalized.title || trimmedTopic}` });
      naturEvent("passport_stamp", { world: "Learning", note: finalized.title || trimmedTopic });
      const quizPrompt = `${trimmedTopic} for age ${numericAge}`;
      try {
        const qResp = await fetch("/.netlify/functions/ai", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "quiz", prompt: quizPrompt }),
        });
        const qText = await qResp.text();
        const qJson = safeParse<{ ok?: boolean; data?: QuizResponse; error?: any }>(qText);
        if (!qResp.ok || !qJson?.data?.questions) {
          const message = extractMessage(qJson?.error, qText || "Quiz could not load right now.");
          toast({ text: message, kind: "warn" });
        } else {
          setQuiz(qJson.data);
          const simplified = qJson.data.questions.map((item) => {
            const letterIndex = { A: 0, B: 1, C: 2, D: 3 }[item.answer];
            const answerText = item.options[letterIndex] ?? "";
            const label = item.answer + (answerText ? `. ${answerText}` : "");
            return { q: item.q, a: label };
          });
          const withQuiz = { ...finalized, quiz: simplified };
          setPlan(withQuiz);
          saveLessonPlan(trimmedTopic, numericAge, withQuiz);
        }
      } catch (quizError) {
        const message = quizError instanceof Error ? quizError.message : "Quiz could not load right now.";
        toast({ text: message, kind: "warn" });
      }
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
                {quiz?.questions?.length ? (
                  <ol className="lesson-quiz__list">
                    {quiz.questions.map((item, index) => (
                      <li key={`${item.q}-${index}`}>
                        <strong>{index + 1}. {item.q}</strong>
                        <ol type="A" className="lesson-quiz__options">
                          {item.options.map((option, optIndex) => {
                            const letter = (ANSWER_LETTERS[optIndex] ?? "A") as QuizResponse["questions"][number]["answer"];
                            const isAnswer = letter === item.answer;
                            return (
                              <li
                                key={`${item.q}-${letter}`}
                                style={{ fontWeight: isAnswer ? 600 : undefined }}
                              >
                                {letter}. {option}
                              </li>
                            );
                          })}
                        </ol>
                      </li>
                    ))}
                  </ol>
                ) : plan.quiz.length ? (
                  <ul>
                    {plan.quiz.map((item, index) => (
                      <li key={`${item.q}-${index}`}>
                        <strong>{item.q}</strong>
                        <span>{item.a}</span>
                      </li>
                    ))}
                  </ul>
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
