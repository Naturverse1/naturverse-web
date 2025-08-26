// Robust, client-only Command Palette wrapper.
// If disabled or anything fails, it renders null and never crashes the app.
import React from 'react';

const ENABLED = import.meta.env.VITE_ENABLE_PALETTE === 'true';

function isClient() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export default function CommandPaletteSafe() {
  const [Inner, setInner] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    if (!ENABLED) return; // feature flag off -> no-op
    if (!isClient()) return; // SSR/first pass safety

    let mounted = true;
    (async () => {
      try {
        const mod = await import('./CommandPaletteInner'); // existing palette logic moved here
        if (mounted) setInner(() => mod.default || (mod as any).CommandPalette || null);
      } catch (err) {
        // Never throw in prod
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn('[naturverse] CommandPalette disabled (load failed):', err);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ENABLED || !Inner) return null;
  return (
    <ErrorCatcher>
      <Inner />
    </ErrorCatcher>
  );
}

function ErrorCatcher({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = React.useState(true);
  return ok ? (
    <React.Suspense fallback={null}>
      <Boundary onError={() => setOk(false)}>{children}</Boundary>
    </React.Suspense>
  ) : null;
}

// Minimal error boundary
class Boundary extends React.Component<{ onError: () => void }, { hasError: boolean }> {
  state = { hasError: false } as { hasError: boolean };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    try {
      this.props.onError();
    } catch {}
  }
  render() {
    return this.state.hasError ? null : (this.props.children as React.ReactNode);
  }
}

