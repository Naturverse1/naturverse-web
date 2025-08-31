import * as React from 'react';
import MiniQuests from './MiniQuests';

export default function WorldExtras() {
  const [path, setPath] = React.useState<string>('');

  React.useEffect(() => {
    const read = () => setPath(location.pathname || '');
    read();

    const push = history.pushState;
    const replace = history.replaceState;
    const onNav = () => read();

    (history as any).pushState = function (...args: any[]) {
      const ret = push.apply(this, args as any);
      window.dispatchEvent(new Event('naturverse:navigate'));
      return ret;
    };
    (history as any).replaceState = function (...args: any[]) {
      const ret = replace.apply(this, args as any);
      window.dispatchEvent(new Event('naturverse:navigate'));
      return ret;
    };
    addEventListener('popstate', onNav);
    addEventListener('naturverse:navigate', onNav);

    return () => {
      removeEventListener('popstate', onNav);
      removeEventListener('naturverse:navigate', onNav);
      (history as any).pushState = push;
      (history as any).replaceState = replace;
    };
  }, []);

  const lower = path.toLowerCase();
  if (lower.startsWith('/auth/')) return null;
  const onThailandia = lower.startsWith('/worlds/thailandia');
  if (!onThailandia) return null;

  return (
    <div style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <MiniQuests />
    </div>
  );
}

