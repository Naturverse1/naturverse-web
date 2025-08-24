import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    /* no-op */
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: "16px" }}>
          <h1>Something went wrong.</h1>
          <p className="muted">
            Please try going <a href="/">home</a> and reopening the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
