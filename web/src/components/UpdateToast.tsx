import { useEffect, useState } from 'react';

export default function UpdateToast() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // page will be controlled by the new SW; reload to get fresh assets
      window.location.reload();
    });

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      if (reg.waiting) setWaiting(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && reg.waiting) setWaiting(reg.waiting);
        });
      });
    });
  }, []);

  if (!waiting) return null;

  return (
    <div style={{
      position:'fixed', left:'50%', bottom:20, transform:'translateX(-50%)',
      background:'rgba(0,0,0,.8)', color:'#fff', padding:'10px 14px',
      borderRadius:10, border:'1px solid rgba(255,255,255,.2)', zIndex:9999
    }}>
      <span>New version ready.</span>
      <button
        style={{marginLeft:10}}
        onClick={() => waiting.postMessage('skipWaiting')}
      >
        Update
      </button>
    </div>
  );
}
