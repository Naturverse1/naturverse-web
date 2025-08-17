import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// --- simple coin banking (compatible with coins.ts pattern) ---
const SAVE_BEST = "nv:eco:best";
const SAVE_COINS = "nv:eco:coins";
const getBest = () => Number(localStorage.getItem(SAVE_BEST) || 0);
const setBest = (n:number) => localStorage.setItem(SAVE_BEST, String(n));
const addCoins = (n:number) => {
  const cur = Number(localStorage.getItem(SAVE_COINS) || 0);
  localStorage.setItem(SAVE_COINS, String(cur + n));
};

// --- tiny runner types ---
type Ob = { x:number; y:number; w:number; h:number; s:number };
type Trash = { x:number; y:number; r:number; s:number; hit?:boolean };

export default function EcoRunner(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [running,setRunning] = useState(false);
  const [score,setScore] = useState(0);
  const [best,setBestState] = useState(getBest());
  const [coinsEarned,setCoinsEarned] = useState(0);
  const keys = useRef({up:false,down:false});
  const state = useRef({
    w:800, h:420, t:0, speed:3.2,
    player:{x:60,y:210,r:16,vy:0},
    ground:340,
    obs: [] as Ob[],
    trash: [] as Trash[],
    gameOver:false,
    frame:0
  });

  // controls (keyboard + touch)
  useEffect(()=>{
    function onKey(e:KeyboardEvent){
      if(e.code==="ArrowUp"||e.code==="Space") keys.current.up = e.type==="keydown";
      if(e.code==="ArrowDown") keys.current.down = e.type==="keydown";
    }
    window.addEventListener("keydown",onKey);
    window.addEventListener("keyup",onKey);
    const c = canvasRef.current!;
    const touch = (goUp:boolean)=>{ keys.current.up = goUp; if(!goUp) keys.current.up=false; };
    c.addEventListener("touchstart",()=>touch(true));
    c.addEventListener("touchend",()=>touch(false));
    return ()=>{ window.removeEventListener("keydown",onKey); window.removeEventListener("keyup",onKey); };
  },[]);

  // resize nicely
  useEffect(()=>{
    const onResize=()=>{
      const c = canvasRef.current!;
      const maxW = Math.min(900, c.parentElement?.clientWidth || 900);
      const scale = maxW / 800;
      state.current.w = Math.round(800*scale);
      state.current.h = Math.round(420*scale);
      c.width = state.current.w; c.height = state.current.h;
      state.current.ground = Math.round(340*scale);
      state.current.player.x = Math.round(60*scale);
      state.current.player.r = Math.max(12, Math.round(16*scale));
    };
    onResize();
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);

  function reset(){
    const s = state.current;
    s.t=0; s.speed=3.2; s.obs=[]; s.trash=[]; s.player.y=200; s.player.vy=0; s.gameOver=false; s.frame=0;
    setScore(0); setCoinsEarned(0);
  }

  function start(){ reset(); setRunning(true); }

  function loop(){
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d")!;
    const s = state.current;
    s.frame++; s.t += 1; s.speed = Math.min(8, s.speed + 0.0009); // slowly gets harder

    // spawn obstacles & trash
    if(s.frame % Math.floor(90 - s.speed*5) === 0){
      s.obs.push({ x:s.w+20, y:s.ground-24, w:28, h:24, s:s.speed+1.2 });
    }
    if(s.frame % Math.floor(75 - s.speed*4) === 0){
      const y = s.ground - (60 + Math.random()*140);
      s.trash.push({ x:s.w+20, y, r:10, s:s.speed+1.5 });
    }

    // physics
    const p = s.player;
    if(keys.current.up){ if(p.y >= s.ground - p.r - 0.5) p.vy = -9.5; }
    if(keys.current.down && p.y < s.ground - p.r) p.vy += 0.6; // faster drop
    p.vy += 0.45; p.y += p.vy;
    if(p.y > s.ground - p.r){ p.y = s.ground - p.r; p.vy = 0; }

    // move objects
    s.obs.forEach(o=>o.x -= o.s);
    s.trash.forEach(t=>t.x -= t.s);

    // collisions & pickups
    // obstacle: AABB vs circle
    for(const o of s.obs){
      const cx = Math.max(o.x, Math.min(p.x, o.x+o.w));
      const cy = Math.max(o.y, Math.min(p.y, o.y+o.h));
      const dx = p.x - cx, dy = p.y - cy;
      if(dx*dx + dy*dy < p.r*p.r){ s.gameOver = true; break; }
    }
    // trash pickup
    for(const t of s.trash){
      if(t.hit) continue;
      const dx = p.x - t.x, dy = p.y - t.y;
      if(dx*dx + dy*dy < (p.r + t.r)*(p.r + t.r)){
        t.hit = true;
        setCoinsEarned(v=>v+1);
      }
    }

    // cleanup offscreen
    s.obs = s.obs.filter(o=>o.x+o.w> -20);
    s.trash = s.trash.filter(t=>t.x+t.r> -20);

    // score
    setScore(v=>v+1);

    // draw
    ctx.clearRect(0,0,s.w,s.h);
    // bg
    const grd = ctx.createLinearGradient(0,0,0,s.h);
    grd.addColorStop(0,"#081629"); grd.addColorStop(1,"#0b1f36"); ctx.fillStyle = grd; ctx.fillRect(0,0,s.w,s.h);
    // ground
    ctx.fillStyle = "#0e2a47"; ctx.fillRect(0,s.ground,s.w,s.h-s.ground);
    // player
    ctx.beginPath(); ctx.fillStyle="#ffd34d"; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    // obstacles
    ctx.fillStyle="#ff6b6b"; s.obs.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));
    // trash
    ctx.fillStyle="#5dd39e"; s.trash.forEach(t=>{ ctx.globalAlpha = t.hit?0.35:1; ctx.beginPath(); ctx.arc(t.x,t.y,t.r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; });

    // HUD
    ctx.fillStyle="#eaf2ff"; ctx.font="14px system-ui, sans-serif";
    ctx.fillText(`Time: ${(s.frame/60).toFixed(1)}s`, 12, 20);
    ctx.fillText(`Coins: ${coinsEarned}`, 12, 40);
    ctx.fillText(`Best: ${best}`, 12, 60);

    if(s.gameOver){
      // settle score & coins
      const final = Math.floor(s.frame/60);
      if(final > best){ setBestState(final); setBest(final); }
      if(coinsEarned>0) addCoins(coinsEarned);
      setRunning(false);
      // overlay
      ctx.fillStyle="rgba(0,0,0,.5)"; ctx.fillRect(0,0,s.w,s.h);
      ctx.fillStyle="#eaf2ff"; ctx.font="20px system-ui, sans-serif";
      ctx.fillText("Game Over!", s.w/2-60, s.h/2-10);
      ctx.font="14px system-ui, sans-serif";
      ctx.fillText(`You collected 🪙 ${coinsEarned}`, s.w/2-78, s.h/2+14);
      ctx.fillText("Press Restart to play again", s.w/2-102, s.h/2+36);
      return; // stop advancing
    }

    if(running) requestAnimationFrame(loop);
  }

  useEffect(()=>{
    if(!running) return;
    const id = requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(id);
  },[running]); // eslint-disable-line

  return (
    <div style={{maxWidth:980, margin:"0 auto", padding:"1rem"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <h1 style={{margin:0}}>Eco Runner</h1>
        <Link to="/zones/arcade">← Back to Arcade</Link>
      </div>
      <p style={{opacity:.9, marginTop:0}}>Jump to avoid obstacles, collect green dots ♻️ to earn coins. Tap/Space to jump, hold ↓ for faster drop.</p>

      <div style={{display:"flex", gap:12, alignItems:"center", margin:"8px 0 12px"}}>
        <button onClick={start} disabled={running} style={{padding:"6px 10px", borderRadius:8, border:"1px solid #27486f", background:"#13233a", color:"#eaf2ff"}}>
          {running ? "Running…" : "Start / Restart"}
        </button>
        <div style={{opacity:.9}}>Best time: <strong>{best}s</strong> • Last run coins: <strong>🪙 {coinsEarned}</strong></div>
      </div>

      <div style={{border:"1px solid #1c3557", borderRadius:12, overflow:"hidden", background:"#0e1b2f"}}>
        <canvas ref={canvasRef} width={800} height={420} />
      </div>
    </div>
  );
}

