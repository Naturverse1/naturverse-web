import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Page not found</h1>
      <p>Let's head back to the Naturverse.</p>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  );
}
