import React from "react";

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode
}, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    // Optionally log error
    // console.error(error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #c00", borderRadius: 8, color: "#c00" }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
          <a href="/">Go Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
