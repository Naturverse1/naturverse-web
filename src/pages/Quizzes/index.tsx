import items from '../../content/quizzes/index.json';
export default function Quizzes() {
  return (
    <div className="container mx-auto p-4">
      <h1>Quizzes</h1>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(q => (
          <li key={q.id} className="border rounded p-3">
            <div className="font-medium">{q.question}</div>
            <ol className="list-decimal ml-5 mt-2">
              {q.choices.map((c, i) => <li key={i}>{c}</li>)}
            </ol>
            <div className="text-xs mt-2 opacity-70">World: {q.world}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

