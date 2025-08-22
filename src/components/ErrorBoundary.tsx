import React from "react";

type State = { hasError: boolean };
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {/* no-op */}
  render() {
    if (this.state.hasError) {
      return (
        <div style={{maxWidth:800, margin:"40px auto", padding:"16px"}}>
          <h1>Something went wrong</h1>
          <p>Please go <a href="/">home</a> and try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
