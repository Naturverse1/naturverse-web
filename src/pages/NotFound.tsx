import React from 'react';

export default function NotFound() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>404 — Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <a href="/" className="btn">
        Back to Home
      </a>
    </div>
  );
}
