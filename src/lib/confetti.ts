// super tiny confetti (no deps)
export function confettiBurst(x = 0.5, y = 0.4) {
  const root = document.createElement('div');
  root.style.position = 'fixed';
  root.style.inset = '0';
  root.style.pointerEvents = 'none';
  document.body.appendChild(root);

  const N = 60;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.left = `${x * window.innerWidth}px`;
    p.style.top = `${y * window.innerHeight}px`;
    p.style.width = '8px';
    p.style.height = '12px';
    p.style.background = ['#2f6dfc','#1b50d8','#4d8bff','#2b6ffd'][i%4];
    p.style.borderRadius = '2px';
    p.style.transform = `translate(-50%,-50%) rotate(${Math.random()*360}deg)`;
    p.style.transition = 'transform 900ms ease-out, opacity 900ms ease-out';
    root.appendChild(p);
    requestAnimationFrame(() => {
      const dx = (Math.random() - 0.5) * 400;
      const dy = (Math.random() - 0.9) * 600; // mostly up
      p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random()*720}deg)`;
      p.style.opacity = '0';
    });
  }
  setTimeout(()=>root.remove(), 1000);
}

type ConfettiEventDetail = {
  x?: number;
  y?: number;
};

let detach: (() => void) | null = null;

export function mountConfettiOnce(): (() => void) | undefined {
  if (typeof window === 'undefined') return undefined;
  if (detach) return detach;

  const clamp = (value: number, fallback: number) => {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(1, Math.max(0, value));
  };

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ConfettiEventDetail>).detail;
    if (detail && (typeof detail.x === 'number' || typeof detail.y === 'number')) {
      const nextX = clamp(detail.x ?? 0.5, 0.5);
      const nextY = clamp(detail.y ?? 0.4, 0.4);
      confettiBurst(nextX, nextY);
      return;
    }
    confettiBurst();
  };

  window.addEventListener('natur:confetti', handler as EventListener);
  detach = () => {
    window.removeEventListener('natur:confetti', handler as EventListener);
    detach = null;
  };

  return detach;
}
