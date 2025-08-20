import { useEffect, useRef, useState } from "react";

export default function GameSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const size = 16, cols = 20, rows = 20;
    c.width = cols * size; c.height = rows * size;

    let snake = [{x:10,y:10}];
    let apple = {x:15,y:15};
    let vx = 1, vy = 0, speed = 120, dead = false;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp"    && vy === 0) { vx=0; vy=-1; }
      if (e.key === "ArrowDown"  && vy === 0) { vx=0; vy= 1; }
      if (e.key === "ArrowLeft"  && vx === 0) { vx=-1; vy=0; }
      if (e.key === "ArrowRight" && vx === 0) { vx= 1; vy=0; }
    };
    window.addEventListener("keydown", onKey);

    const tick = () => {
      if (dead) return;
      const head = {x: snake[0].x + vx, y: snake[0].y + vy};
      if (head.x<0||head.y<0||head.x>=cols||head.y>=rows||snake.some(p=>p.x===head.x&&p.y===head.y)){ dead=true; return; }
      snake.unshift(head);
      if (head.x===apple.x && head.y===apple.y) {
        setScore(s=>s+1);
        apple = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
      } else snake.pop();

      ctx.fillStyle="#0b1220"; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle="#86efac"; snake.forEach(p=>ctx.fillRect(p.x*size, p.y*size, size-1, size-1));
      ctx.fillStyle="#fca5a5"; ctx.fillRect(apple.x*size, apple.y*size, size-1, size-1);
    };

    const id = setInterval(tick, speed);
    return () => { clearInterval(id); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div className="game">
      <h3>Snake — Score: {score}</h3>
      <canvas ref={canvasRef} style={{border:"1px solid #e2e8f0", borderRadius:8}} />
    </div>
  );
}
