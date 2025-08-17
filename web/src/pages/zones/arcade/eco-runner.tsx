import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const K = (s: string) => `nv:eco:${s}`;

export default function EcoRunner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem(K("best")) || 0));
  const [coins, setCoins] = useState(() => Number(localStorage.getItem(K("coins")) || localStorage.getItem("nv:wb:coins") || 0));

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = Math.min(900, c.parentElement?.clientWidth || 900));
    let h = (c.height = Math.round(w * 0.56));
    const onResize = () => { w = c.width = Math.min(900, c.parentElement?.clientWidth || 900); h = c.height = Math.round(w * 0.56); };
    window.addEventListener("resize", onResize);

    // world
    const G = 0.7;
    const groundY = h - 60;

    const player = { x: 80, y: groundY, vy: 0, r: 18, jumping: false, alive: true };
    const hazards: { x: number; y: number; r: number; kind: "spill" | "rock" }[] = [];
    const pickups: { x: number; y: number; r: number; kind: "leaf" | "coin" }[] = [];

    let t = 0;
    let speed = 5;
    let raf = 0;

    function jump() {
      if (!player.alive) return;
      if (!player.jumping) {
        player.vy = -12; player.jumping = true;
      }
    }

    function restart() {
      player.y = groundY; player.vy = 0; player.jumping = false; player.alive = true;
      hazards.length = 0; pickups.length = 0; t = 0; speed = 5; setScore(0); setRunning(true);
      loop();
    }

    // controls
    const key = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); }
      if (e.key.toLowerCase() === "p") { setRunning(r => !r); }
      if (e.key.toLowerCase() === "r") { restart(); }
    };
    window.addEventListener("keydown", key);
    c.addEventListener("pointerdown", jump);

    function circleCollide(ax:number,ay:number,ar:number,bx:number,by:number,br:number){
      const dx=ax-bx, dy=ay-by; return dx*dx+dy*dy < (ar+br)*(ar+br);
    }

    function spawn() {
      // hazards every ~60–120 frames, pickups more often
      if (t % Math.max(40, 120 - (score/10)) === 0) {
        hazards.push({ x: w + 20, y: groundY, r: 16 + Math.random()*8, kind: Math.random() < 0.7 ? "spill":"rock" });
      }
      if (t % 45 === 0) {
        pickups.push({ x: w + 20, y: groundY - (40 + Math.random()*80), r: 12, kind: Math.random() < 0.75 ? "leaf":"coin" });
      }
    }

    function drawGround() {
      // gradient sky
      const g = ctx.createLinearGradient(0,0,0,h);
      g.addColorStop(0,"#0b1424"); g.addColorStop(1,"#0e1b2f");
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

      // horizon/ground
      ctx.fillStyle = "#0a1a2e";
      ctx.fillRect(0, groundY + 20, w, h);
      ctx.fillStyle = "#15314f";
      ctx.fillRect(0, groundY, w, 24);

      // parallax streaks
      ctx.strokeStyle = "#264b71"; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
      for (let i=0;i<6;i++){ ctx.beginPath(); const yy = groundY - 60 - i*22; ctx.moveTo((t*0.5 + i*80)%w - w, yy); ctx.lineTo(((t*0.5 + i*80)%w)+w, yy); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }

    function drawPlayer() {
      // body
      ctx.fillStyle = "#9dfc7b";
      ctx.beginPath(); ctx.arc(player.x, player.y- player.r, player.r, 0, Math.PI*2); ctx.fill();

      // face/seed eyes
      ctx.fillStyle = "#0b1220";
      ctx.beginPath(); ctx.arc(player.x-6, player.y-player.r-2, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(player.x+6, player.y-player.r-2, 3, 0, Math.PI*2); ctx.fill();

      // little leaf top
      ctx.fillStyle = "#7be35e";
      ctx.beginPath(); ctx.ellipse(player.x, player.y-player.r-14, 7, 4, -0.6, 0, Math.PI*2); ctx.fill();
    }

    function drawObjects() {
      // hazards
      hazards.forEach(o=>{
        ctx.save();
        if (o.kind==="spill") { // oil spill
          ctx.fillStyle="#2b2730"; ctx.beginPath(); ctx.ellipse(o.x, o.y+6, o.r+18, 10, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle="#3a3344"; ctx.beginPath(); ctx.ellipse(o.x, o.y+2, o.r+12, 8, 0, 0, Math.PI*2); ctx.fill();
        } else { // rock
          ctx.fillStyle="#5a6a7e"; ctx.beginPath(); ctx.moveTo(o.x-o.r, o.y); ctx.lineTo(o.x, o.y- o.r*1.2); ctx.lineTo(o.x+o.r, o.y); ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      });

      // pickups
      pickups.forEach(p=>{
        if (p.kind==="leaf"){
          ctx.fillStyle="#8cff7a"; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r+2, p.r, -0.6, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle="#3a6a4a"; ctx.beginPath(); ctx.moveTo(p.x-6,p.y); ctx.lineTo(p.x+6,p.y); ctx.stroke();
        } else {
          ctx.fillStyle="#ffd66e"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle="#876200"; ctx.font="bold 12px system-ui"; ctx.textAlign="center"; ctx.fillText("¢", p.x, p.y+4);
        }
      });
    }

    function drawHUD() {
      ctx.fillStyle = "#eaf2ff"; ctx.font = "16px system-ui";
      ctx.fillText(`⭐ Score: ${score}`, 16, 24);
      ctx.fillText(`🏆 Best: ${best}`, 16, 46);
      ctx.fillText(`🪙 Coins: ${coins}`, 16, 68);
      if (!player.alive){
        ctx.fillStyle="#eaf2ff"; ctx.font="bold 26px system-ui"; ctx.textAlign="center";
        ctx.fillText("Game Over — press R to restart", w/2, h/2);
      } else if (!running){
        ctx.fillStyle="#eaf2ff"; ctx.font="bold 26px system-ui"; ctx.textAlign="center";
        ctx.fillText("Paused — press P to resume", w/2, h/2);
      }
    }

    function step() {
      if (!player.alive || !running) return;
      t++;

      // spawn & speed ramp
      if (t % 6 === 0) setScore(s => s + 1);
      if (t % 240 === 0) speed += 0.4;
      spawn();

      // physics
      player.vy += G;
      player.y += player.vy;
      if (player.y >= groundY){ player.y = groundY; player.vy = 0; player.jumping = false; }

      hazards.forEach(o => o.x -= speed);
      pickups.forEach(p => p.x -= speed);

      // collisions
      hazards.forEach(o => {
        if (circleCollide(player.x, player.y-player.r, player.r, o.x, o.y, o.r)) {
          player.alive = false; setRunning(false);
          // persist best + coins
          const newBest = Math.max(best, score); setBest(newBest);
          localStorage.setItem(K("best"), String(newBest));
          localStorage.setItem(K("coins"), String(coins));
        }
      });
      for (let i=pickups.length-1;i>=0;i--){
        const p = pickups[i];
        if (circleCollide(player.x, player.y-player.r, player.r, p.x, p.y, p.r)){
          if (p.kind==="leaf") setScore(s => s + 5); else {
            const c = coins + 1; setCoins(c); localStorage.setItem(K("coins"), String(c));
          }
          pickups.splice(i,1);
        }
      }

      // cull
      while (hazards.length && hazards[0].x < -60) hazards.shift();
      while (pickups.length && pickups[0].x < -60) pickups.shift();
    }

    function render() {
      ctx.clearRect(0,0,w,h);
      drawGround();
      drawObjects();
      drawPlayer();
      drawHUD();
    }

    function frame() { step(); render(); loop(); }
    function loop() { raf = requestAnimationFrame(frame); }

    // start
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", key);
      c.removeEventListener("pointerdown", jump);
    };
  }, []);

  return (
    <div style={{maxWidth: 980, margin: "0 auto", padding: "1rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h1 style={{margin:0}}>🌿 Eco Runner</h1>
        <Link to="/zones/arcade" style={{opacity:.9}}>← Back to Arcade</Link>
      </div>
      <p style={{opacity:.9, marginTop:4}}>
        Tap / Space / ↑ to jump. Avoid 🛢️, collect 🌿 and 🪙. P = pause, R = restart.
      </p>
      <canvas ref={canvasRef} style={{width:"100%", borderRadius:12, background:"#0b1424"}} />
    </div>
  );
}

