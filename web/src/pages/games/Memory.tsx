import { useEffect, useMemo, useState } from 'react';
import { addScore, top } from '../../games/leaderboard';
const CARDS = '🍎🍌🍇🍓🥝🍍'.split('');
export default function Memory() {
  const board = useMemo(()=>[...CARDS,...CARDS].sort(()=>Math.random()-0.5),[]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<boolean[]>(Array(board.length).fill(false));
  const [moves, setMoves] = useState(0);
  useEffect(()=>{
    if(open.length===2){
      setMoves(m=>m+1);
      const [a,b]=open;
      setTimeout(()=>{
        if(board[a]===board[b]) setMatched(m=>m.map((v,i)=>v||(i===a||i===b)));
        setOpen([]);
      },500);
    }
  },[open,board]);
  useEffect(()=>{
    if(matched.every(Boolean)){ addScore({game:'memory',name:'You',score:100-moves,at:Date.now()}); }
  },[matched,moves]);
  return (
    <>
      <h2>Memory</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,60px)',gap:8}}>
        {board.map((c,i)=>{
          const show = open.includes(i) || matched[i];
          return (
            <button key={i} style={{height:60,fontSize:28}}
              disabled={show || open.length===2}
              onClick={()=>setOpen(o=>[...o,i])}>
              {show ? c : '❓'}
            </button>
          );
        })}
      </div>
      <p>Moves: {moves}</p>
      <h3>Top Scores</h3>
      <ol>{top('memory').map((s,i)=><li key={i}>{s.score}</li>)}</ol>
    </>
  );
}
