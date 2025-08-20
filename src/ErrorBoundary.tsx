import { Component, ReactNode } from "react";

export default class ErrorBoundary extends Component<{children: ReactNode},{error?: Error}> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error("App crashed:", error); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui" }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
