import React from 'react';

type Q = { q: string; options: string[]; answer: string };
type QuizData = { questions: Q[] };

export default function Quiz({ topic, age }: { topic: string; age: number }) {
  const [data, setData] = React.useState<QuizData>();
  const [err, setErr] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!topic.trim() || !Number.isFinite(age) || age <= 0) {
      setData(undefined);
      return;
    }

    let alive = true;
    (async () => {
      setLoading(true);
      setErr(undefined);
      try {
        const r = await fetch('/.netlify/functions/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'quiz', prompt: `Topic: ${topic}\nAge: ${age}` })
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error ?? 'Quiz error');
        if (alive) setData(j);
      } catch (e: any) {
        if (alive) setErr(String(e.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [topic, age]);

  if (!topic.trim() || !Number.isFinite(age) || age <= 0) {
    return <p className="text-sm text-gray-500">Add a topic and age to generate a quiz.</p>;
  }

  if (loading) return <p>Loading quiz…</p>;
  if (err) return <p className="text-red-600">Quiz error: {err}</p>;
  if (!data?.questions?.length) return <p>Quiz coming soon.</p>;

  return (
    <ol className="space-y-4">
      {data.questions.map((q, i) => (
        <li key={i}>
          <p className="font-medium">{q.q}</p>
          <div className="mt-1 grid gap-2">
            {q.options.map((opt, k) => (
              <label key={k} className="flex gap-2 items-center">
                <input type="radio" name={`q-${i}`} value={opt} /> <span>{opt}</span>
              </label>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
