import React from 'react';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error, info);
    }
  }

  private copy = () => {
    const err = this.state.error;
    if (!err) return;
    const text = `${err.message}\n${err.stack}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  render() {
    if (this.state.error) {
      return (
        <div className="page-container" style={{ textAlign: 'center', padding: '80px 16px' }}>
          <h1>Something went wrong</h1>
          <p>Try reload.</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <a className="button" href="/">Go Home</a>
            <button className="button" onClick={this.copy}>Copy error</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
