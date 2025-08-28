import * as React from "react";
import "./error.css";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Optional: hook up to telemetry later
    console.error("App error:", error, info);
  }

  reset = () => {
    this.setState({ error: null });
    // Try a soft reload to recover route state
    location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <main className="nv-err" role="alert" aria-live="assertive">
          <h1>Something went wrong</h1>
          <p>We hit an unexpected error. Try reloading the page.</p>
          <pre className="nv-err__msg">{this.state.error.message}</pre>
          <div className="nv-err__actions">
            <button onClick={this.reset}>Reload</button>
            <a className="btn" href="/">Go home</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
