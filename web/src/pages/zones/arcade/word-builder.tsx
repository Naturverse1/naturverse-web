import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Puzzle = { id: string; letters: string[]; words: string[]; title: string };

const PUZZLES: Puzzle[] = [
  {
    id: "nature",
    title: "Naturverse Letters",
    letters: ["N","A","T","U","R","E","V"],
    words: [
      "nature","venture","raven","avenue","tuner","tuna","aunt","rant","rant","turn","tune","rune","rent","earn","near",
      "neat","tear","run","tan","ant","art","nut","urn","true","rate","tear","yearn"
    ]
  },
  {
    id: "ocean",
    title: "Ocean Letters",
    letters: ["O","C","E","A","N","D","S"],
    words: [
      "ocean","canoe","second","scan","sand","soda","dose","case","code","codes","cone","once","can","cane","canes",
      "seas","sea","soon","son","and","nose","done","send","ascend"
    ]
  },
  {
    id: "forest",
    title: "Forest Letters",
    letters: ["F","O","R","E","S","T","M"],
    words: [
      "forest","frost","storm","store","rest","most","more","form","from","sore","rose","term","sort","tome","mote",
      "moss","soft","rots","rots","stem","tomes"
    ]
  }
];

// utility
const dayIndex = () => Math.floor(Date.now() / 86400000);
const K = (s:string)=>`nv:wb:${s}`;
const fmt = (sec:number)=>`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(Math.floor(sec%60)).padStart(2,"0")}`;

export default function WordBuilder() {
  const today = dayIndex();
  const puzzle = useMemo(() => PUZZLES[today % PUZZLES.length], [today]);

  const [letters, setLetters] = useState<string[]>(() => shuffle(puzzle.letters));
  const [entry, setEntry] = useState("");
  const [found, setFound] = useState<string[]>(() => JSON.parse(localStorage.getItem(K(`found:${puzzle.id}`)) || "[]"));
  const [score, setScore] = useState<number>(() => Number(localStorage.getItem(K(`score:${puzzle.id}`)) || 0));
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem(K(`best:${puzzle.id}`)) || 0));
  const [elapsed, setElapsed] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  // timer
  const tRef = useRef<number | null>(null);
  useEffect(() => { tRef.current = window.setInterval(()=>setElapsed(e=>e+1), 1000); return ()=>{ if(tRef.current) window.clearInterval(tRef.current); }; }, []);

  // persist
  useEffect(() => localStorage.setItem(K(`found:${puzzle.id}`), JSON.stringify(found)), [found, puzzle.id]);
  useEffect(() => localStorage.setItem(K(`score:${puzzle.id}`), String(score)), [score, puzzle.id]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") submit();
      else if (e.key === "Backspace") setEntry((s)=>s.slice(0,-1));
      else if (/^[a-zA-Z]$/.test(e.key)) setEntry((s)=> (s + e.key.toUpperCase()).slice(0, 18));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function shuffle<T>(a:T[]):T[] { const b=a.slice(); for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

  function tap(ch:string){ setEntry(s => (s + ch).slice(0,18)); }
  function clearEntry(){ setEntry(""); }
  function shuffleLetters(){ setLetters(l => shuffle(l)); }

  function submit(){
    const w = entry.toLowerCase();
    if (w.length < 3) return nudge("Try 3+ letters");
    const valid = puzzle.words.includes(w);
    if (!valid) return nudge("Not in today’s list");
    if (found.includes(w)) return nudge("Already found");

    // score: length + small speed bonus
    const gained = w.length + (elapsed < 60 ? 1 : 0);
    const newScore = score + gained;
    setFound([...found, w].sort());
    setScore(newScore);

    // coins
    const coinsKey = K("coins");
    const coins = Number(localStorage.getItem(coinsKey) || 0) + Math.max(1, Math.floor(w.length/2));
    localStorage.setItem(coinsKey, String(coins));

    setEntry("");
    nudge(`+${gained} points!`);
    if (!best || newScore > best) { setBest(newScore); localStorage.setItem(K(`best:${puzzle.id}`), String(newScore)); }
  }

  function nudge(text:string){ setMsg(text); window.setTimeout(()=>setMsg(null), 900); }

  return (
    <div className="wrap">
      <style>{CSS}</style>
      <div className="top">
        <h1>🔤 Word Builder</h1>
        <Link className="back" to="/zones/arcade">← Back to Arcade</Link>
      </div>

      <p className="sub">{puzzle.title}. Build real words from these letters. (Today’s puzzle rotates daily.)</p>

      <div className="hud">
        <span>⏱ {fmt(elapsed)}</span>
        <span>⭐ Score: <b>{score}</b></span>
        <span>🏆 Best: <b>{best || "—"}</b></span>
        <Coins />
      </div>

      <div className="letters">
        {letters.map((ch, i)=>(
          <button key={i} className="tile" onClick={()=>tap(ch)} aria-label={`Letter ${ch}`}>{ch}</button>
        ))}
        <button className="tile ghost" onClick={shuffleLetters}>↻</button>
      </div>

      <div className="entry">
        <input value={entry} onChange={(e)=>setEntry(e.target.value.toUpperCase())} placeholder="Type or tap letters…" />
        <button onClick={submit}>Submit</button>
        <button className="ghost" onClick={clearEntry}>Clear</button>
      </div>

      {!!msg && <div className="toast">{msg}</div>}

      <div className="found">
        <h3>Found ({found.length})</h3>
        <ul>{found.map(w=><li key={w}>{w}</li>)}</ul>
      </div>
    </div>
  );
}

function Coins(){
  const [coins, setCoins] = useState<number>(()=>Number(localStorage.getItem(K("coins"))||0));
  useEffect(()=>{ const t = setInterval(()=>setCoins(Number(localStorage.getItem(K("coins"))||0)), 600); return ()=>clearInterval(t); },[]);
  return <span>🪙 Coins: <b>{coins}</b></span>;
}

const CSS = `
.wrap{max-width:980px;margin:0 auto;padding:1.25rem;color:#eaf2ff}
.top{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.sub{opacity:.9;margin:.25rem 0 1rem}
.back{opacity:.9}
.hud{display:flex;gap:1rem;flex-wrap:wrap;margin:.5rem 0 1rem}
.letters{display:grid;grid-template-columns:repeat(auto-fit,minmax(54px,1fr));gap:.5rem;max-width:560px}
.tile{border:0;border-radius:12px;padding:.8rem 0;background:linear-gradient(180deg,#24344b,#2f3e57);color:#eaf2ff;
  box-shadow:0 0 0 1px #0006 inset,0 6px 16px #0005;font-size:1.2rem}
.tile.ghost{background:transparent;border:1px solid #6aa8ff88}
.entry{display:flex;gap:.5rem;align-items:center;margin:1rem 0}
.entry input{flex:1;min-width:190px;background:#0e1624;border:1px solid #436a9a88;border-radius:10px;color:#eaf2ff;
  padding:.6rem .8rem}
.entry button{padding:.55rem .9rem;border-radius:10px;border:0;background:#91f2ff;color:#0b1220}
.entry .ghost{background:transparent;border:1px solid #6aa8ff88;color:#eaf2ff}
.found{margin-top:1rem}
.found ul{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.4rem;list-style:none;padding:0}
.found li{background:#15233a;border:1px solid #223554;border-radius:10px;padding:.35rem .55rem}
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;background:#0d1420f0;border:1px solid #436a9a88;
  padding:.5rem .8rem;border-radius:10px}
@media (max-width:560px){.letters{grid-template-columns:repeat(5,1fr)}}
`;
