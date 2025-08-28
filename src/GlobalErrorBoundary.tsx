import React from 'react';

export class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { err?: any }> {
  state = { err: undefined as any };

  static getDerivedStateFromError(err: any) {
    return { err };
  }

  componentDidCatch(err: any, info: any) {
    console.error('[boot] render failed', err, info);
  }

  render() {
    if (!this.state.err) return this.props.children as any;
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>Something went wrong</h1>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {String(this.state.err?.stack || this.state.err)}
        </pre>
      </div>
    );
  }
}
