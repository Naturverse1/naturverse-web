import React, { useEffect, useRef } from 'react';

export default function ImmersiveBackground() {
  if (typeof window === 'undefined') return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }));

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    let frame: number;
    let last = 0;
    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (now - last < 1000 / 45) return; // throttle ~45fps
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x * canvas.width, d.y * canvas.height, d.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="immersive-gradient" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

