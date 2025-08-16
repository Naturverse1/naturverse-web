import React, { useState } from "react";

type Q = { q: string; choices: string[]; answerIndex: number; why: string };

export default function AutoQuiz() {
  const [passage, setPassage] = useState("Rainforests are layered habitats with a canopy that captures most sunlight…");
  const [loading, setLoading] = useState(false);
  const [qs, setQs] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  async function generate() {
    setLoading(true);
    setQs([]);
    setAnswers([]);
    const res = await fetch("/.netlify/functions/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passage }),
    });
    const json = await res.json();
    const out: Q[] = json.questions || [];
    setQs(out);
    setAnswers(new Array(out.length).fill(-1));
    setLoading(false);
  }

  function select(i: number, choice: number) {
    const next = [...answers];
    next[i] = choice;
    setAnswers(next);
  }

  const score = qs.reduce((acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0), 0);

  return (
    <div className="container" style={{ maxWidth: 840, margin: "0 auto", padding: "2rem" }}>
      <h1>Auto-Quiz</h1>
      <p>Paste a short passage; get ready-to-use MCQs.</p>

      <textarea
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={generate} disabled={loading}>
        {loading ? "Generating…" : "Generate Quiz"}
      </button>

      {qs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          {qs.map((q, i) => (
            <div
              key={i}
              style={{
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <strong>
                {i + 1}. {q.q}
              </strong>
              <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                {q.choices.map((c, j) => (
                  <label key={j} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === j}
                      onChange={() => select(i, j)}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
              {answers[i] >= 0 && (
                <div style={{ marginTop: 8, fontStyle: "italic" }}>
                  {answers[i] === q.answerIndex
                    ? "✅ Correct!"
                    : `❌ The answer is "${q.choices[q.answerIndex]}".`} {q.why}
                </div>
              )}
            </div>
          ))}
          <h3>
            Your score: {score}/{qs.length}
          </h3>
        </div>
      )}
    </div>
  );
}
