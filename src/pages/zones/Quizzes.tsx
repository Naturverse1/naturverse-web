import React, { useState } from "react";
import Leaderboard from "../../components/Leaderboard";

const SAMPLE = [
  { q: "Capital of Thailand?", a: ["Bangkok","Chiang Mai","Phuket"], i: 0 },
  { q: "Which fruit is spiky?", a: ["Mango","Durian","Banana"], i: 1 },
];

export default function Quizzes() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const done = idx >= SAMPLE.length;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Quizzes</h1>
      {!done ? (
        <div className="space-y-2 border rounded p-3">
          <div className="font-semibold">{SAMPLE[idx].q}</div>
          <div className="grid sm:grid-cols-3 gap-2">
            {SAMPLE[idx].a.map((opt, i)=>(
              <button key={i} className="border rounded p-2 hover:bg-neutral-50"
                onClick={()=>{
                  if (i===SAMPLE[idx].i) setScore(s=>s+1);
                  setIdx(k=>k+1);
                }}>
                {opt}
              </button>
            ))}
          </div>
          <div className="text-sm text-neutral-600">Score: {score}</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-lg font-semibold">Finished! Score: {score}/{SAMPLE.length}</div>
          <Leaderboard game="quiz-basic" />
        </div>
      )}
    </div>
  );
}
