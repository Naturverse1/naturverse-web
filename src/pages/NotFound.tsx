import React from "react";

export default function NotFound() {
  return (
    <main style={{maxWidth:900,margin:"0 auto",padding:20}}>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <a className="btn" href="/">Back to Home</a>
    </main>
  );
}
