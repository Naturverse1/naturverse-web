import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any) { console.error("ErrorBoundary", err); }
  render() {
    if (this.state.hasError) {
      return (
        <main style={{maxWidth:900,margin:"0 auto",padding:20}}>
          <h1>Something went wrong</h1>
          <p>Please refresh the page. If this continues, return <a href="/">home</a>.</p>
        </main>
      );
    }
    return this.props.children;
  }
}
