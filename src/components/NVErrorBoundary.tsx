import { Component, ReactNode } from "react";
import { track } from "../utils/telemetry";

type State = { hasError: boolean; message?: string };

export default class NVErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }
  componentDidCatch(err: unknown) {
    track.error("NVErrorBoundary", err instanceof Error ? err.message : String(err));
    // still allow Netlify/console to capture
    console.error(err);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "var(--naturverse-blue)" }}>Something went wrong.</h1>
          <p style={{ opacity: .8, maxWidth: 520, margin: "0 auto 12px" }}>
            Please try again. If the issue persists, refresh the page.
          </p>
          <button className="btn" onClick={() => location.reload()}>Reload</button>
        </div>
      </main>
    );
  }
}
