import React, { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number; s: number };

function makeStars(w: number, h: number, count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.6 + 0.4, // depth
      r: Math.random() * 0.7 + 0.3, // radius
      s: Math.random() * 0.4 + 0.1, // speed
    });
  }
  return stars;
}

export default function StarfieldCanvas({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    starsRef.current = makeStars(w, h, Math.min(220, Math.floor((w * h) / 18000)));

    const onResize = () => {
      w = (canvas.width = window.innerWidth);
      h = (canvas.height = window.innerHeight);
      starsRef.current = makeStars(w, h, Math.min(220, Math.floor((w * h) / 18000)));
    };
    window.addEventListener("resize", onResize);

    const render = (t: number) => {
      if (!enabled) return;
      const dt = Math.min(33, t - lastRef.current || 16);
      lastRef.current = t;
      ctx.clearRect(0, 0, w, h);

      // subtle parallax based on mouse
      const mx = (window as any).__nv_mx ?? 0;
      const my = (window as any).__nv_my ?? 0;

      for (const s of starsRef.current) {
        s.x += s.s * s.z * 0.3;
        if (s.x > w + 2) s.x = -2;

        const px = s.x + mx * (1 - s.z) * 8;
        const py = s.y + my * (1 - s.z) * 8;

        ctx.globalAlpha = 0.5 + 0.5 * s.z;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(render);
    };

    if (enabled) {
      rafRef.current = requestAnimationFrame(render);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      (window as any).__nv_mx = e.clientX / window.innerWidth - 0.5;
      (window as any).__nv_my = e.clientY / window.innerHeight - 0.5;
    };
    if (enabled) window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -2,
        width: "100vw",
        height: "100vh",
        opacity: enabled ? 0.8 : 0,
        transition: "opacity 300ms ease",
      }}
    />
  );
}
