import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section style={{ padding: "32px 16px" }}>
      <div
        style={{
          maxWidth: 840,
          margin: "0 auto",
          background: "white",
          borderRadius: 16,
          border: "1px solid #e6eefc",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: 24,
        }}
      >
        <h1 style={{ color: "var(--naturverse-blue)", marginTop: 0 }}>
          Page not found
        </h1>
        <p style={{ marginBottom: 16 }}>
          The page you’re looking for doesn’t exist (or moved).
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            textDecoration: "none",
            background: "var(--naturverse-blue)",
            color: "white",
            padding: "12px 16px",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          Go home
        </Link>
      </div>
    </section>
  );
}

