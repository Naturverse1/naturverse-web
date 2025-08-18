import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    try {
      const payload = {
        ts: new Date().toISOString(),
        error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        info,
      };
      console.error('[Naturverse] App crashed', payload);
      const key = 'naturverse_last_error';
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            color: '#fff',
            background: '#0b1020',
          }}
        >
          <div style={{ maxWidth: 680, textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 12px' }}>Something went wrong</h1>
            <p style={{ opacity: 0.8 }}>
              Try a hard refresh. If that doesn’t work, clear site data/cache.
              {/* If we previously had a SW, let users bust cache */}
              <br />
              <a href="/?cache-bust=1">Reload</a>
            </p>
            {this.state.message && (
              <code style={{ display: 'block', marginTop: 12, opacity: 0.7 }}>{this.state.message}</code>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
