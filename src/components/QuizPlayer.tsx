import React, { useMemo, useState } from "react";
import { MCQuestion, Quiz, JeopardyCategory, JeopardyCell } from "../lib/quiz/types";

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export const ClassicPlayer: React.FC<{ quiz: Extract<Quiz, {mode:"classic"}>; onDone?: (score:number)=>void; }> = ({ quiz, onDone }) => {
  const qs = useMemo(() => shuffle(quiz.questions), [quiz]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const q = qs[i] as MCQuestion;

  const answer = (optId: string) => {
    const correct = q.options.find(o => o.id === optId)?.correct;
    if (correct) setScore(s => s + 1);
    const next = i + 1;
    if (next >= qs.length) {
      onDone?.(score + (correct ? 1 : 0));
    } else {
      setI(next);
    }
  };

  return (
    <div className="quiz-card">
      <div className="meta">Question {i+1} / {qs.length}</div>
      <h3>{q.prompt}</h3>
      <div className="choices">
        {shuffle(q.options).map(o => (
          <button key={o.id} className="btn choice" onClick={()=>answer(o.id)}>{o.text}</button>
        ))}
      </div>
      <div className="meta">Score: {score}</div>
    </div>
  );
};

export const JeopardyBoard: React.FC<{ quiz: Extract<Quiz, {mode:"jeopardy"}> }> = ({ quiz }) => {
  const [board, setBoard] = useState<JeopardyCategory[]>(quiz.board);
  const [active, setActive] = useState<JeopardyCell | null>(null);
  const [score, setScore] = useState(0);

  const openCell = (c: JeopardyCell, ci: number, ri: number) => {
    if (c.taken) return;
    setActive({ ...c });
    const copy = board.map(cat => ({ ...cat, cells: cat.cells.map(cell => ({...cell})) }));
    copy[ci].cells[ri].taken = true;
    setBoard(copy);
  };

  return (
    <div>
      <div className="meta">Score: {score}</div>
      <div className="jeop-grid" role="table" aria-label="Jeopardy Board">
        {board.map((cat, ci) => (
          <div key={cat.id} className="jeop-col" role="column">
            <div className="jeop-head">{cat.title}</div>
            {cat.cells.map((cell, ri) => (
              <button key={cell.id}
                className={"jeop-cell" + (cell.taken ? " taken" : "")}
                onClick={()=>openCell(cell, ci, ri)}
                disabled={!!cell.taken}>
                {cell.taken ? "—" : cell.points}
              </button>
            ))}
          </div>
        ))}
      </div>

      {active && (
        <div className="modal">
          <div className="modal-card">
            <h3>{active.question}</h3>
            <div className="actions">
              <button className="btn" onClick={()=>{ setScore(s=>s+active.points); setActive(null); }}>Correct</button>
              <button className="btn outline" onClick={()=>setActive(null)}>Reveal</button>
            </div>
            <p className="meta">Answer: {active.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const QuizSummary: React.FC<{ title:string; score:number; total:number; onRestart:()=>void; }> = ({ title, score, total, onRestart }) => (
  <div className="quiz-card">
    <h3>{title} — Finished</h3>
    <p>You scored <b>{score}</b> / {total}</p>
    <button className="btn" onClick={onRestart}>Play Again</button>
  </div>
);
