import { useEffect, useState } from 'react';
import { addScore, top } from '../../games/leaderboard';

export default function Tapper() {
  const [t, setT] = useState(10);
  const [score, setScore] = useState(0);
  useEffect(()=>{ const id=setInterval(()=>setT(x=>x-1),1000); return()=>clearInterval(id);},[]);
  useEffect(()=>{ if(t<=0){ addScore({game:'tapper',name:'You',score,at:Date.now()}); }},[t,score]);
  return (
    <>
      <h2>Tapper</h2>
      <p>Tap the button as many times as you can in 10 seconds.</p>
      <p>Time: {Math.max(0,t)}s · Score: {score}</p>
      <button disabled={t<=0} onClick={()=>setScore(s=>s+1)} style={{fontSize:24}}>TAP!</button>
      <h3>Top Scores</h3>
      <ol>{top('tapper').map((s,i)=><li key={i}>{s.score}</li>)}</ol>
    </>
  );
}
