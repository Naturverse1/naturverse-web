import { FormEvent, useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useToast } from "../../components/Toast";
import Quiz from "../../components/naturversity/Quiz";
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
    quiz: [],
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
      const response = await callAI<LessonResponse>("lesson", {
        prompt: trimmedTopic,
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
                {aiEnabled ? (
                  <Quiz topic={topic} age={numericAge} />
                ) : (
                  <p className="placeholder">Enable AI helpers to load quiz questions.</p>
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
