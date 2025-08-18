import React from 'react';
import ErrorOverlay, { getErrorLog } from './ErrorOverlay';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, error: err instanceof Error ? err : new Error(String(err)) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    try {
      const payload = {
        ts: new Date().toISOString(),
        error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        info,
        log: getErrorLog(),
      };
      console.error('[Naturverse] App crashed', payload);
      const key = 'naturverse_last_error';
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (import.meta.env.PROD) {
        return <ErrorOverlay error={this.state.error} />;
      }
      return (
        <div style={{ padding: '24px', color: '#fff', background: '#0b1020' }}>
          <h1>Something went wrong</h1>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
