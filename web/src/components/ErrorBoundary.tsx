import { Component, ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.error("[Naturverse] App crashed", err); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{padding:24, color:"#fff", background:"#0b1220"}}>
          <h1>Something went wrong</h1>
          <button onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
