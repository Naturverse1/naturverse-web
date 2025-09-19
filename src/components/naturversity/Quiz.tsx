import { useState } from "react";
import { callAI } from "@/lib/ai";

type QuizOption = string;
type QuizQ = { q: string; options: QuizOption[]; answer: string };
type QuizData = { questions: QuizQ[] };

type Props = {
  topic: string;
  age: number;
};

function normalizeQuiz(input: any): QuizData | null {
  if (!input || !Array.isArray(input.questions)) return null;

  const questions: QuizQ[] = input.questions
    .slice(0, 3)
    .map((entry: any) => {
      const q = String(entry?.q ?? "").trim();
      const answer = String(entry?.answer ?? "").trim().toUpperCase();
      const rawOptions = Array.isArray(entry?.options) ? entry.options : [];
      const options = rawOptions
        .slice(0, 4)
        .map((opt: unknown) => String(opt ?? "").trim())
        .filter((opt: string) => opt.length > 0);

      return { q, options, answer };
    })
    .filter((item: QuizQ) => item.q.length > 0 && item.options.length > 0);

  if (questions.length === 0) return null;

  return { questions };
}

export default function Quiz({ topic, age }: Props) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const trimmed = topic.trim();
    if (!trimmed) {
      setError("Enter a topic first.");
      return;
    }

    if (!Number.isFinite(age) || age <= 0) {
      setError("Add an age to personalize the quiz.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const promptAge = Number.isFinite(age) && age > 0 ? Math.round(age) : undefined;
      const data = await callAI<QuizData>("quiz", {
        prompt: `${trimmed} for age ${promptAge ?? "kids"}`,
        age: promptAge,
      });
      const normalized = normalizeQuiz(data);
      if (!normalized) {
        setQuiz(null);
        setError("Quiz unavailable right now. Try again.");
        return;
      }
      setQuiz(normalized);
      setAnswers({});
    } catch (e: any) {
      setQuiz(null);
      setError(e?.message || "Quiz failed");
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((item, index) => {
      const guess = (answers[index] || "").toUpperCase();
      if (guess && item.answer && guess === item.answer.toUpperCase()) {
        correct += 1;
      }
    });
    setResult(`You got ${correct} / ${quiz.questions.length} correct!`);
  };

  const handleSelect = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button
        type="button"
        className="lesson-btn"
        onClick={load}
        disabled={loading}
      >
        {loading ? "Loading…" : quiz ? "Load another quiz" : "Load quiz"}
      </button>

      {quiz ? (
        <div style={{ display: "grid", gap: 16 }}>
          {quiz.questions.map((item, index) => (
            <div key={`${item.q}-${index}`} className="quiz-q" style={{ border: "1px solid #e0e7ff", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                {index + 1}. {item.q}
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {item.options.map((opt, optIndex) => {
                  const value = String.fromCharCode(65 + optIndex);
                  return (
                    <label key={`${item.q}-${value}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="radio"
                        name={`quiz-${index}`}
                        value={value}
                        checked={(answers[index] || "") === value}
                        onChange={(event) => handleSelect(index, event.target.value)}
                      />
                      <span>
                        {value}. {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <button type="button" className="lesson-btn" onClick={submit}>
            Check answers
          </button>
        </div>
      ) : (
        <p className="placeholder" style={{ margin: 0 }}>
          Three check-in questions will show here after loading a quiz.
        </p>
      )}

      {result && <p style={{ margin: 0, fontWeight: 600 }}>{result}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
