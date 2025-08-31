import React from "react";

export default function SuccessPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
  const sessionId = params.get("session_id");

  return (
    <main style={{ padding: 20 }}>
      <h1>Payment successful!</h1>
      {sessionId && <p>Your session ID is {sessionId}.</p>}
      <p>
        <a href="/">Return home</a>
      </p>
    </main>
  );
}
