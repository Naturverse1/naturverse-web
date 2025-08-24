import React from "react";

type State = { hasError: boolean; err?: unknown };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, err };
  }
  componentDidCatch(err: unknown, info: unknown) {
    // optional: console to surface during dev
    console.error("ErrorBoundary", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="page" style={{ padding: 24 }}>
          <h1>Something went wrong.</h1>
          <p className="muted">Please refresh or go back to the <a href="/">home page</a>.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
