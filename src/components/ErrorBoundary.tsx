import React from 'react';

type State = { hasError: boolean; msg?: string };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, msg: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err: unknown, info: unknown) {
    // noop (can log later)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <h1>Something went wrong</h1>
          <p className="muted">The page failed to render. Try going back home.</p>
          <a className="btn" href="/">Back to Home</a>
          {this.state.msg && (
            <pre className="muted" style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.msg}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
