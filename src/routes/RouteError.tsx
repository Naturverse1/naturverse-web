import * as React from "react";
import "../components/error.css";

export default function RouteError() {
  return (
    <main className="nv-err" role="alert" aria-live="assertive">
      <h1>We couldn’t load this page.</h1>
      <p>Please check your connection, then try again.</p>
      <div className="nv-err__actions">
        <button onClick={() => location.reload()}>Retry</button>
        <a className="btn" href="/">Go home</a>
      </div>
    </main>
  );
}
