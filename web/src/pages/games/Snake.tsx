import { useEffect, useRef, useState } from 'react';
import { addScore, top } from '../../games/leaderboard';

export default function Snake(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score,setScore] = useState(0);
  useEffect(()=>{
    const c=canvasRef.current!; const ctx=c.getContext('2d')!;
    const size=20, cells=15; c.width=c.height=cells*size;
    let dir={x:1,y:0}, snake=[{x:7,y:7}], food=spawn();
    function spawn(){ return {x:Math.floor(Math.random()*cells), y:Math.floor(Math.random()*cells)};}
    function step(){
      const head={x:(snake[0].x+dir.x+cells)%cells, y:(snake[0].y+dir.y+cells)%cells};
      if(snake.some(s=>s.x===head.x&&s.y===head.y)){ addScore({game:'snake',name:'You',score,at:Date.now()}); return; }
      snake=[head,...snake];
      if(head.x===food.x&&head.y===food.y){ setScore(s=>s+1); food=spawn(); } else snake.pop();
      ctx.fillStyle='#111'; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle='#0f0'; snake.forEach(s=>ctx.fillRect(s.x*size,s.y*size,size-1,size-1));
      ctx.fillStyle='#f33'; ctx.fillRect(food.x*size,food.y*size,size-1,size-1);
    }
    const id=setInterval(step,120);
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='ArrowUp')dir={x:0,y:-1}; if(e.key==='ArrowDown')dir={x:0,y:1}; if(e.key==='ArrowLeft')dir={x:-1,y:0}; if(e.key==='ArrowRight')dir={x:1,y:0};};
    window.addEventListener('keydown',onKey);
    return()=>{ clearInterval(id); window.removeEventListener('keydown',onKey); };
  },[score]);
  return (
    <>
      <h2>Snake</h2>
      <p>Score: {score}</p>
      <canvas ref={canvasRef} style={{border:'1px solid #ddd'}}/>
      <h3>Top Scores</h3>
      <ol>{top('snake').map((s,i)=><li key={i}>{s.score}</li>)}</ol>
    </>
  );
}
