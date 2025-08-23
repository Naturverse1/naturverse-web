import React from 'react';

export default function NotFound() {
  return (
    <div className="page">
      <h1>Page not found</h1>
      <p className="muted">The link you followed doesn’t exist yet.</p>
      <a className="btn" href="/">Back to Home</a>
    </div>
  );
}
