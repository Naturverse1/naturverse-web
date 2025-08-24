import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{maxWidth:1100,margin:"0 auto",padding:16}}>
          <h1>Something went wrong.</h1>
          <p className="muted">Please go back home and try again.</p>
          <a className="btn" href="/">Back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
