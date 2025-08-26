/**
 * Tiny canvas confetti (dependency-free).
 * Usage: burst({x, y, colors?, count?})
 */
type Point = { x: number; y: number };

export function burst({
  x,
  y,
  colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8"],
  count = 40,
}: Point & { colors?: string[]; count?: number }) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  function resize() {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }
  resize();

  const cx = x * dpr;
  const cy = y * dpr;
  const parts = Array.from({ length: count }, () => ({
    x: cx,
    y: cy,
    vx: (Math.random() - 0.5) * 8 * dpr,
    vy: (Math.random() - 0.9) * 10 * dpr,
    g: 0.25 * dpr,
    r: Math.random() * 3 * dpr + 2 * dpr,
    c: colors[Math.floor(Math.random() * colors.length)],
    life: 60 + Math.random() * 20,
  }));

  let raf = 0;
  const step = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    for (const p of parts) {
      if (p.life <= 0) continue;
      alive++;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.beginPath();
      ctx.fillStyle = p.c as string;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (alive > 0) {
      raf = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };
  raf = requestAnimationFrame(step);

  // clean up on resize to avoid weird scaling
  const onResize = () => {
    cancelAnimationFrame(raf);
    canvas.remove();
    window.removeEventListener("resize", onResize);
  };
  window.addEventListener("resize", onResize, { once: true });
}
