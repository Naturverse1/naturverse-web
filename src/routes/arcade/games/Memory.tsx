import { useMemo, useState } from "react";
const EMOJI = ["🐶","🐱","🦊","🐼","🐸","🐵","🐯","🦁"];

export default function GameMemory(){
  const deck = useMemo(()=>shuffle([...EMOJI, ...EMOJI]).map((v,i)=>({id:i, v})),[]);
  const [open,setOpen]=useState<number[]>([]);
  const [matched,setMatched]=useState<number[]>([]);
  const [moves,setMoves]=useState(0);

  const click=(i:number)=>{
    if (open.includes(i) || matched.includes(i)) return;
    const next=[...open,i];
    setOpen(next);
    if (next.length===2){
      setMoves(m=>m+1);
      const [a,b]=next;
      if (deck[a].v===deck[b].v){ setMatched(m=>[...m,a,b]); setOpen([]); }
      else setTimeout(()=>setOpen([]),700);
    }
  };

  return (
    <div>
      <h3>Memory — Moves: {moves}</h3>
      <div className="grid">
        {deck.map((card,i)=>{
          const show=open.includes(i)||matched.includes(i);
          return (
            <button key={card.id} className={"tile"+(show?" show":"")} onClick={()=>click(i)}>
              {show?card.v:"❓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function shuffle<T>(a:T[]){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]= [a[j],a[i]];} return a; }
