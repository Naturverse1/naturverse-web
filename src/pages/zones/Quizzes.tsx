import React, { useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Quiz } from "../../lib/quiz/types";
import { SAMPLE_QUIZZES } from "../../lib/quiz/sampleQuizzes";
import { ClassicPlayer, JeopardyBoard, QuizSummary } from "../../components/QuizPlayer";
import "../../styles/zone-widgets.css";

const LS_CUSTOM = "naturverse.quizzes.custom";

function loadCustom(): Quiz[] { try { return JSON.parse(localStorage.getItem(LS_CUSTOM) || "[]"); } catch { return []; } }
function saveCustom(qs: Quiz[]) { try { localStorage.setItem(LS_CUSTOM, JSON.stringify(qs)); } catch {} }
const uid = () => Math.random().toString(36).slice(2,9);

export default function Quizzes() {
  const [tab, setTab] = useState<"play"|"party"|"builder"|"coming">("play");
  const [custom, setCustom] = useState<Quiz[]>(loadCustom());
  const quizzes = useMemo(() => [...SAMPLE_QUIZZES, ...custom], [custom]);
  const [activeId, setActiveId] = useState<string>(quizzes[0]?.id || "");
  const active = quizzes.find(q => q.id === activeId) || quizzes[0];

  // classic score state
  const [final, setFinal] = useState<{score:number; total:number} | null>(null);

  // builder state (classic only for now)
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [qs, setQs] = useState<{prompt:string; a:string; b:string; c:string; d:string; correct:"a"|"b"|"c"|"d"}[]>([
    { prompt: "Sample question?", a: "A", b: "B", c: "C", d: "D", correct: "a" }
  ]);
  const addQ = () => setQs(v => [...v, { prompt:"", a:"", b:"", c:"", d:"", correct:"a" }]);
  const saveQuiz = () => {
    const quiz: Quiz = {
      id: `local-${uid()}`,
      mode: "classic",
      emoji,
      title: title || "Untitled Quiz",
      questions: qs.map(q => ({
        id: uid(),
        type: "mc",
        prompt: q.prompt || "Question",
        options: [
          { id: uid(), text: q.a, correct: q.correct === "a" },
          { id: uid(), text: q.b, correct: q.correct === "b" },
          { id: uid(), text: q.c, correct: q.correct === "c" },
          { id: uid(), text: q.d, correct: q.correct === "d" },
        ],
      })),
    };
    const next = [quiz, ...custom]; setCustom(next); saveCustom(next);
    setTab("play"); setActiveId(quiz.id);
  };

  return (
    <div>
      <Breadcrumbs items={[
        { href: '/', label: 'Home' },
        { href: '/zones', label: 'Zones' },
        { label: 'Quizzes' }
      ]} />
      <h1>🎯 Quizzes</h1>
      <p>Solo & party quiz play with scoring (client-only; no backend).</p>

      <div className="tabs" role="tablist" aria-label="Quizzes">
        <button className="tab" aria-selected={tab==="play"} onClick={()=>setTab("play")}>Play</button>
        <button className="tab" aria-selected={tab==="party"} onClick={()=>setTab("party")}>Party</button>
        <button className="tab" aria-selected={tab==="builder"} onClick={()=>setTab("builder")}>Builder</button>
        <button className="tab" aria-selected={tab==="coming"} onClick={()=>setTab("coming")}>Coming Soon</button>
      </div>

      {tab === "play" && (
        <section className="creator-grid">
          <div>
            <h2>Choose a set</h2>
            <div className="list-grid">
              {quizzes.map(q=>(
                <button key={q.id}
                        className="card-mini"
                        onClick={()=>{ setActiveId(q.id); setFinal(null); }}
                        style={{ textAlign:"left", border: q.id===activeId ? "2px solid #111827" : undefined }}>
                  <div style={{fontSize:22}}>{q.emoji || "🧠"}</div>
                  <div style={{fontWeight:700}}>{q.title}</div>
                  <div className="meta">{q.mode === "classic" ? "Multiple Choice" : "Jeopardy Board"}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2>Play</h2>
            {active.mode === "classic" && !final && (
              <ClassicPlayer
                quiz={active}
                onDone={(score)=>setFinal({ score, total: (active as any).questions.length })}
              />
            )}
            {active.mode === "classic" && final && (
              <QuizSummary
                title={active.title}
                score={final.score}
                total={final.total}
                onRestart={()=>setFinal(null)}
              />
            )}
            {active.mode === "jeopardy" && (
              <JeopardyBoard quiz={active}/>
            )}
          </div>
        </section>
      )}

      {tab === "party" && (
        <section>
          <h2>Party Mode (local)</h2>
          <p className="meta">Use the Jeopardy board on a shared screen. Tap a tile, read the clue, award points with “Correct”.</p>
          <p className="meta">Live tournaments & world rankings will connect here later.</p>
        </section>
      )}

      {tab === "builder" && (
        <section>
          <h2>Create a Quiz (classic)</h2>
          <div className="form-row">
            <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
            <input className="input small" placeholder="Emoji" value={emoji} onChange={e=>setEmoji(e.target.value)}/>
          </div>

          <div className="list-grid">
            {qs.map((q, i)=>(
              <div key={i} className="card-mini">
                <input className="input" placeholder="Prompt" value={q.prompt} onChange={e=>{
                  const v=[...qs]; v[i].prompt=e.target.value; setQs(v);
                }}/>
                {(["a","b","c","d"] as const).map(k=>(
                  <div key={k} className="radio-row">
                    <input className="input" placeholder={`Option ${k.toUpperCase()}`} value={q[k]} onChange={e=>{
                      const v=[...qs]; (v[i] as any)[k]=e.target.value; setQs(v);
                    }}/>
                    <label className="meta">
                      <input type="radio" name={`correct-${i}`} checked={q.correct===k} onChange={()=> {
                        const v=[...qs]; v[i].correct=k; setQs(v);
                      }}/> correct
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="btn outline" onClick={addQ}>Add question</button>
            <button className="btn" onClick={saveQuiz}>Save to Play</button>
          </div>
          <p className="meta">Quizzes save to your browser (localStorage).</p>
        </section>
      )}

      {tab === "coming" && (
        <section>
          <h2>Coming Soon</h2>
          <ul>
            <li>Live tournaments with rooms & timers.</li>
            <li>World rankings & leaderboards.</li>
            <li>Question banks via Naturversity & Passport XP.</li>
          </ul>
        </section>
      )}
    </div>
  );
}
