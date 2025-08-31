import React from 'react';

type State = { hasError: boolean; message?: string };

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err: unknown) {
    console.error('[naturverse] app error boundary caught:', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          maxWidth: 640,
          margin: '4rem auto',
          padding: '1rem',
          border: '1px solid #dbeafe',
          borderRadius: 12,
        }}
      >
        <h2 style={{ color: 'var(--nv-accent)', marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          {this.state.message || 'An unexpected error occurred.'}
        </p>
        <button className="btn-accent" onClick={() => location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}
