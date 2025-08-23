import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Optional: send to your future logging/telemetry
    // console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: '16px',
              margin: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'var(--nv-surface, #fff)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Something went wrong.</h3>
            <p>Try refreshing the page. If it keeps happening, we’ll fix it fast.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

