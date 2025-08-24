import React from "react";

export default function NotFound() {
  return (
    <div style={{maxWidth:900,margin:"24px auto",padding:"16px"}}>
      <h1>Page not found</h1>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <a className="btn" href="/">Back to Home</a>
    </div>
  );
}
