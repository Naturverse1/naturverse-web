import React from "react";

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log in production bundles so we can see the real cause
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, fontFamily: "system-ui" }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error.message}</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error.stack}
          </pre>
          <button onClick={() => location.reload()} style={{ padding: 8 }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
