import React from "react";

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err: unknown, info: unknown) {
    // optional: console log so we don't white screen silently
    console.error("App crashed:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="main" className="page" style={{ maxWidth: 900, margin: "24px auto" }}>
          <h1>Something went wrong</h1>
          <p className="muted">Please try again or go back to the homepage.</p>
          {this.state.message && (
            <pre style={{ background:"#fff", border:"1px solid #e5e7eb", padding:12, borderRadius:12, overflow:"auto" }}>
              {this.state.message}
            </pre>
          )}
          <a className="btn" href="/">← Back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

