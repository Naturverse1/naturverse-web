import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackNote?: string;
};

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Keep this simple; sending to a logger can be added later.
    // eslint-disable-next-line no-console
    console.error("[naturverse] ErrorBoundary caught", error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Fallback
        title={this.props.fallbackTitle}
        note={this.props.fallbackNote}
        onRetry={this.reset}
      />
    );
  }
}

function Fallback({
  title = "Something went wrong.",
  note = "You can try again, or head back to the home page.",
  onRetry,
}: {
  title?: string;
  note?: string;
  onRetry: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "1px solid #e6eefc",
          padding: "24px",
        }}
      >
        <h1 style={{ color: "var(--naturverse-blue)", margin: "0 0 8px" }}>
          {title}
        </h1>
        <p style={{ margin: "0 0 16px", color: "#234" }}>{note}</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/")}
            style={btnStyle}
            aria-label="Go home"
          >
            Go home
          </button>
          <button onClick={onRetry} style={btnGhostStyle} aria-label="Try again">
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "var(--naturverse-blue)",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 700,
  boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
  cursor: "pointer",
};

const btnGhostStyle: React.CSSProperties = {
  ...btnStyle,
  background: "transparent",
  color: "var(--naturverse-blue)",
  border: "2px solid var(--naturverse-blue)",
  boxShadow: "none",
};

