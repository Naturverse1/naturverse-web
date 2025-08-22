import React from "react";

type State = { hasError: boolean };
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.error("[ErrorBoundary]", err); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{maxWidth:840,margin:"40px auto",padding:16}}>
          <h1>Something went wrong.</h1>
          <p>Try refreshing the page. If the issue persists, we’ll fix it fast.</p>
          <a href="/" className="btn">Back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
