import React, { useState } from "react";

export default function WellnessZone() {
  const [seconds, setSeconds] = useState(60);
  const [run, setRun] = useState(false);

  React.useEffect(()=>{
    if (!run) return;
    const t = setInterval(()=>setSeconds(s=> (s>0? s-1:0)), 1000);
    return ()=>clearInterval(t);
  },[run]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Wellness Zone</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Breathing Timer</h2>
        <div className="flex items-center gap-2">
          <input type="number" className="border rounded p-2 w-20" value={seconds} onChange={(e)=>setSeconds(parseInt(e.target.value||"0"))}/>
          <button onClick={()=>setRun(true)} className="px-3 py-2 rounded bg-green-600 text-white">Start</button>
          <button onClick={()=>{ setRun(false); }} className="px-3 py-2 rounded border">Pause</button>
          <button onClick={()=>{ setRun(false); setSeconds(60); }} className="px-3 py-2 rounded border">Reset</button>
        </div>
        <div className="text-3xl font-bold">{seconds}s</div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Yoga & Stretches</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Sun Salute x3</li><li>Tree Pose 30s</li><li>Cat-Cow 10x</li>
        </ul>
      </section>
    </div>
  );
}
