import React from "react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>404 — Not Found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <p><Link to="/">Go home</Link></p>
    </div>
  );
}
