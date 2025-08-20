import { useEffect, useMemo, useState } from "react";
const WORDS = "nature leaf river mountain ocean forest panda eagle mango coconut bamboo".split(" ");

export default function GameTyping(){
  const target = useMemo(()=>WORDS.sort(()=>Math.random()-0.5).slice(0,5),[]);
  const [i,setI]=useState(0);
  const [input,setInput]=useState("");
  const [start]=useState(Date.now());
  const done = i>=target.length;

  useEffect(()=>{ if (input.trim()===target[i]){ setI(v=>v+1); setInput(""); }},[input,i,target]);

  return (
    <div>
      <h3>Typing</h3>
      {done ? <p>Finished in {Math.round((Date.now()-start)/1000)}s</p> : (
        <>
          <p>Type the word:</p>
          <p style={{fontSize:24, fontWeight:800}}>{target[i]}</p>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="type here" />
        </>
      )}
    </div>
  );
}
