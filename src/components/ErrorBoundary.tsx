import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 820, margin: "30px auto" }}>
          <h1>Something went wrong</h1>
          <p className="muted">
            A page component crashed. Try reloading or going back home.
          </p>
          <a className="btn" href="/">← Back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
