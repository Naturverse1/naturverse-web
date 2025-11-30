import { useEffect } from 'react';

type ConfettiBurstProps = {
  trigger: boolean;
};

export default function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  useEffect(() => {
    if (!trigger || typeof document === 'undefined') return;
    const endTime = Date.now() + 800;
    const timeoutIds: number[] = [];
    let frameId: number | null = null;

    const spawn = () => {
      if (Date.now() >= endTime) return;
      const particle = document.createElement('div');
      particle.textContent = '🎉';
      particle.style.position = 'fixed';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = '-2rem';
      particle.style.fontSize = '20px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.animation = 'fall 1000ms linear forwards';
      document.body.appendChild(particle);
      const timeoutId = window.setTimeout(() => {
        particle.remove();
      }, 1000);
      timeoutIds.push(timeoutId);
      frameId = window.requestAnimationFrame(spawn);
    };

    frameId = window.requestAnimationFrame(spawn);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      timeoutIds.forEach(id => window.clearTimeout(id));
    };
  }, [trigger]);

  return null;
}
