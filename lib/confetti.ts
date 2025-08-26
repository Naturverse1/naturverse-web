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
    p.style.background = ['#2f6dfc', '#1b50d8', '#4d8bff', '#2b6ffd'][i % 4];
    p.style.borderRadius = '2px';
    p.style.transform = `translate(-50%,-50%) rotate(${Math.random() * 360}deg)`;
    p.style.transition = 'transform 900ms ease-out, opacity 900ms ease-out';
    root.appendChild(p);
    requestAnimationFrame(() => {
      const dx = (Math.random() - 0.5) * 400;
      const dy = (Math.random() - 0.9) * 600;
      p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 720}deg)`;
      p.style.opacity = '0';
    });
  }
  setTimeout(() => root.remove(), 1000);
}
