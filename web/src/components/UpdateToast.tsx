import { useEffect, useState } from 'react';

export default function UpdateToast() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            setWaiting(sw); setVisible(true);
          }
        });
      });
    });

    // If a new worker already waiting:
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.waiting && (setWaiting(r.waiting), setVisible(true)));
    });
  }, []);

  const reload = () => {
    waiting?.postMessage('SKIP_WAITING');
    // reload after the controller changes to the new SW
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
  };

  if (!visible) return null;
  return (
    <div className="nv-update-toast">
      <span>New update ready.</span>
      <button onClick={reload}>Refresh</button>
    </div>
  );
}
